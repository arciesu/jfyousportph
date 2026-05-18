import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Product from './pages/Product'
import { LenisProvider } from './hooks/useLenis'

export default function App() {
  return (
    <LenisProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
      </Routes>
    </LenisProvider>
  )
}
