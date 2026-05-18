import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const OUTFIT_CARDS = [
  {
    image: '/assets/img-flat-lay.jpg',
    name: 'Soft Grip Socks',
    price: '₱450',
  },
  {
    image: '/assets/img-lifestyle-editorial.jpg',
    name: 'Cloud Mat Carrier',
    price: '₱1,200',
  },
  {
    image: '/assets/img-product-detail.jpg',
    name: 'Air Flow Tank Top',
    price: '₱980',
  },
]

export default function CompleteTheLookSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!sectionRef.current) return

    const cards = sectionRef.current.querySelectorAll('.outfit-card')

    const ctx = gsap.context(() => {
      gsap.fromTo(cards,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8,
          stagger: 0.15,
          ease: 'cubic-bezier(0.2, 1, 0.3, 1)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="w-full bg-milk py-20 lg:py-[120px]"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <h2 className="font-editorial text-[28px] text-muted-navy text-center mb-16">
          Complete the Look
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {OUTFIT_CARDS.map((card, i) => (
            <button
              key={i}
              className="outfit-card text-left group cursor-pointer opacity-0"
              onClick={() => navigate('/product')}
            >
              <div
                className="overflow-hidden transition-all duration-400 group-hover:-translate-y-1"
                style={{ borderRadius: '2px' }}
              >
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full object-cover transition-shadow duration-400 group-hover:shadow-[0_16px_48px_rgba(3,4,94,0.1)]"
                  style={{
                    aspectRatio: '3/4',
                    borderRadius: '2px',
                    boxShadow: '0 8px 32px rgba(3, 4, 94, 0.06)',
                  }}
                />
              </div>
              <p className="font-outfit text-sm text-muted-navy mt-4">{card.name}</p>
              <p className="font-mono text-xs text-muted-navy/50 mt-1">{card.price}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
