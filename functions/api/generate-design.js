// Generates a t-shirt design image from a customer's text description.
//
// Two backends, chosen by environment:
//   1. Local AI (preferred when set): DESIGN_API_URL (+ optional
//      DESIGN_API_KEY as a bearer token). The endpoint must accept
//      POST { prompt } and return { imageUrl }. Meant to point at a
//      Cloudflare Tunnel in front of a local image model (Stable
//      Diffusion / ComfyUI / FLUX API). The tunnel URL stays
//      server-side; browsers never see it.
//   2. OpenAI fallback: OPENAI_API_KEY, pay-per-use via gpt-image-1.
//
// Without either, the endpoint reports 503 so the frontend can explain
// setup is still pending.

function json(body, status) {
  return Response.json(body, { status })
}

function getEnv(context, name) {
  const value = context?.env?.[name]
  return typeof value === "string" ? value.trim() : value
}

const MAX_PROMPT_LENGTH = 500

async function generateWithLocalApi(url, apiKey, prompt) {
  const headers = { "Content-Type": "application/json" }
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ prompt }),
  })

  if (!response.ok) {
    console.error("Local design API failed with status:", response.status)
    return null
  }

  const data = await response.json()
  return typeof data?.imageUrl === "string" ? data.imageUrl : null
}

async function generateWithOpenAI(apiKey, prompt) {
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: `T-shirt graphic design on a transparent background, centered, no mockup, no person, no watermark: ${prompt}`,
      size: "1024x1024",
      background: "transparent",
    }),
  })

  if (!response.ok) {
    console.error("OpenAI design generation failed with status:", response.status)
    return null
  }

  const data = await response.json()
  const b64 = data?.data?.[0]?.b64_json
  return b64 ? `data:image/png;base64,${b64}` : null
}

export async function onRequestPost(context) {
  let prompt = ""
  try {
    const body = await context.request.json()
    prompt = typeof body?.prompt === "string" ? body.prompt.trim() : ""
  } catch {
    return json({ error: "Invalid request." }, 400)
  }

  if (prompt.length < 4 || prompt.length > MAX_PROMPT_LENGTH) {
    return json(
      { error: "Please describe your design in a few words." },
      400,
    )
  }

  const localUrl = getEnv(context, "DESIGN_API_URL")
  const localKey = getEnv(context, "DESIGN_API_KEY")
  const openaiKey = getEnv(context, "OPENAI_API_KEY")

  if (!localUrl && !openaiKey) {
    return json(
      { error: "AI design generation is not set up yet." },
      503,
    )
  }

  let imageUrl = null
  try {
    imageUrl = localUrl
      ? await generateWithLocalApi(localUrl, localKey, prompt)
      : await generateWithOpenAI(openaiKey, prompt)
  } catch (err) {
    console.error("Design generation request threw:", err)
  }

  if (!imageUrl) {
    return json(
      { error: "The design could not be generated. Please try again." },
      502,
    )
  }

  return json({ imageUrl })
}
