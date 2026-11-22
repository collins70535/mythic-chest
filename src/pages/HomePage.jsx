import FeaturedSection from "../components/FeaturedSection"
import NewArrivals from "../components/NewArrivals"
import Hero from "../components/Hero"
import TrustBar from "../components/TrustBar"
import AboutPreview from "../components/AboutPreview"

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TrustBar />
      <FeaturedSection />
      <NewArrivals />
      <AboutPreview />
    </main>
  )
}
