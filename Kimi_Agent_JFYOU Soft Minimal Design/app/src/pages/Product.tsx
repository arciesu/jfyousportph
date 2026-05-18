import Navigation from '../components/Navigation'
import ProductHeroSection from '../sections/ProductHeroSection'
import CompleteTheLookSection from '../sections/CompleteTheLookSection'
import Footer from '../components/Footer'

export default function Product() {
  return (
    <>
      <Navigation />
      <main>
        <ProductHeroSection />
        <CompleteTheLookSection />
      </main>
      <Footer />
    </>
  )
}
