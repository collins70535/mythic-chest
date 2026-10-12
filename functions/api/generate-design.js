// Generates a t-shirt design image from a customer's text description using
// OpenAI's image API. Requires the OPENAI_API_KEY Pages environment variable;
// without it the endpoint reports 503 so the frontend can explain setup is
// still pending.

function json(body, status) {
  return Response.json(body, { status })
}

const MAX_PROMPT_LENGTH = 500

export async function onRequestPost(context) {
  const apiKey = context?.env?.OPENAI_API_KEY?.trim()

  if (!apiKey) {
    return json(
      { error: "AI design generation is not set up yet." },
      503,
    )
  }

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

  let response
  try {
    response = await fetch("https://api.openai.com/v1/images/generations", {
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
  } catch (err) {
    console.error("Design generation request threw:", err)
    return json(
      { error: "The design could not be generated. Please try again." },
      502,
    )
  }

  if (!response.ok) {
    console.error("Design generation failed with status:", response.status)
    return json(
      { error: "The design could not be generated. Please try again." },
      502,
    )
  }

  const data = await response.json()
  const b64 = data?.data?.[0]?.b64_json

  if (!b64) {
    return json(
      { error: "The design could not be generated. Please try again." },
      502,
    )
  }

  return json({ imageUrl: `data:image/png;base64,${b64}` })
}
