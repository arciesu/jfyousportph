import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'

const ACCORDION_ITEMS = [
  {
    title: 'MATERIAL',
    content: '76% Nylon, 24% Elastane. Breathable four-way stretch.',
  },
  {
    title: 'FIT',
    content: 'True to size. Model wears size S. High-waist, 7/8 length.',
  },
  {
    title: 'CARE',
    content: 'Machine wash cold. Hang dry. Do not bleach or iron.',
  },
]

const COLORS = [
  { name: 'Dusty Blue', hex: '#219ebc' },
  { name: 'Milk White', hex: '#fdfcf8', border: true },
  { name: 'Warm Peach', hex: '#ffb5a7' },
  { name: 'Muted Navy', hex: '#03045e' },
]

const SIZES = ['XS', 'S', 'M', 'L', 'XL']

export default function ProductHeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const dataRef = useRef<HTMLDivElement>(null)
  const [openAccordion, setOpenAccordion] = useState<number | null>(null)
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState(1)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const navigate = useNavigate()

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(imageRef.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'cubic-bezier(0.2, 1, 0.3, 1)' }
      )

      const els = dataRef.current?.querySelectorAll('.product-data-item')
      if (els) {
        gsap.fromTo(els,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8,
            stagger: 0.1,
            ease: 'cubic-bezier(0.2, 1, 0.3, 1)',
            delay: 0.3,
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })
  }

  return (
    <section
      ref={sectionRef}
      className="w-full min-h-[100dvh] pt-16"
      style={{ background: 'rgba(142, 202, 230, 0.05)' }}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-20">
        {/* Back link */}
        <button
          onClick={() => navigate('/')}
          className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-navy/40 hover:text-muted-navy transition-colors mb-12"
        >
          &larr; BACK TO COLLECTION
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-16">
          {/* Product Image */}
          <div className="product-data-item opacity-0">
            <img
              ref={imageRef}
              src="/assets/img-product-detail.jpg"
              alt="Air Flow Seamless Set"
              className="w-full object-cover opacity-0"
              style={{
                borderRadius: '2px',
                boxShadow: '0 20px 60px rgba(3, 4, 94, 0.08)',
              }}
            />
          </div>

          {/* Product Data */}
          <div ref={dataRef} className="py-4">
            <span className="product-data-item block font-mono text-[10px] uppercase tracking-[0.12em] text-muted-navy/35 opacity-0">
              JF-2024-BLU-01
            </span>

            <h1 className="product-data-item font-editorial italic text-[clamp(28px,3vw,44px)] text-muted-navy mt-3 opacity-0">
              Air Flow Seamless Set
            </h1>

            <p className="product-data-item font-outfit text-lg font-light text-muted-navy mt-4 opacity-0">
              ₱2,450
            </p>

            <p className="product-data-item font-outfit text-sm font-light text-muted-navy/60 leading-[1.7] mt-6 max-w-[400px] opacity-0">
              Buttery-soft seamless fabric that moves with you. Designed for low-impact sessions and everyday ease. The Air Flow set features a cropped tank with built-in support and high-waist leggings with a subtle compressive hold.
            </p>

            {/* Accordion */}
            <div className="product-data-item mt-8 opacity-0">
              {ACCORDION_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className="border-b border-muted-navy/[0.06] py-4"
                >
                  <button
                    onClick={() => setOpenAccordion(openAccordion === i ? null : i)}
                    className="flex items-center justify-between w-full"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-navy">
                      {item.title}
                    </span>
                    <span className="font-mono text-base text-muted-navy">
                      {openAccordion === i ? '−' : '+'}
                    </span>
                  </button>
                  {openAccordion === i && (
                    <p className="font-outfit text-[13px] font-light text-muted-navy/60 mt-3 leading-relaxed">
                      {item.content}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Color Selector */}
            <div className="product-data-item mt-8 opacity-0">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-navy/50 block mb-3">
                COLOR
              </span>
              <div className="flex gap-3">
                {COLORS.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    className="w-7 h-7 rounded-full transition-transform duration-200 hover:scale-[1.15]"
                    style={{
                      backgroundColor: color.hex,
                      border: color.border ? '1px solid rgba(3, 4, 94, 0.15)' : 'none',
                      boxShadow: selectedColor === i
                        ? '0 0 0 2px #03045e, 0 0 0 4px #fdfcf8'
                        : 'none',
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="product-data-item mt-6 opacity-0">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-navy/50 block mb-3">
                SIZE
              </span>
              <div className="flex gap-2">
                {SIZES.map((size, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(i)}
                    className="w-10 h-10 font-mono text-xs border transition-all duration-200"
                    style={{
                      borderRadius: '2px',
                      borderColor: selectedSize === i ? '#03045e' : 'rgba(3, 4, 94, 0.15)',
                      backgroundColor: selectedSize === i ? '#03045e' : 'transparent',
                      color: selectedSize === i ? '#fdfcf8' : '#03045e',
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              className="product-data-item mt-8 w-full max-w-[400px] h-[52px] font-mono text-xs uppercase tracking-[0.12em] text-milk border-none transition-all duration-300 opacity-0"
              style={{
                borderRadius: '2px',
                background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, #219ebc 0%, #03045e 50%)`,
              }}
              onMouseMove={handleMouseMove}
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
