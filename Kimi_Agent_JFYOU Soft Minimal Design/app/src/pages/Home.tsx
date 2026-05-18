import Navigation from '../components/Navigation'
import HeroSection from '../sections/HeroSection'
import LifestyleSection from '../sections/LifestyleSection'
import CollectionSection from '../sections/CollectionSection'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <LifestyleSection />
        <CollectionSection />
      </main>
      <Footer />
    </>
  )
}
