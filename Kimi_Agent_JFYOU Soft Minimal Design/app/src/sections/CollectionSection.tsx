import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const gridItems = [
  { asset: '/assets/img-product-detail.jpg', aspect: '3/4' },
  { asset: '/assets/img-pilates-studio.jpg', aspect: '4/3' },
  { asset: '/assets/img-flat-lay.jpg', aspect: '3/4' },
  { asset: '/assets/img-lifestyle-editorial.jpg', aspect: '4/3' },
  { asset: '/assets/img-product-detail.jpg', aspect: '3/4' },
  { asset: '/assets/img-pilates-studio.jpg', aspect: '3/4' },
  { asset: '/assets/img-flat-lay.jpg', aspect: '4/3' },
  { asset: '/assets/img-lifestyle-editorial.jpg', aspect: '3/4' },
  { asset: '/assets/img-product-detail.jpg', aspect: '4/3' },
]

export default function CollectionSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!gridRef.current) return

    const items = gridRef.current.querySelectorAll<HTMLDivElement>('.grid-item')
    const images = gridRef.current.querySelectorAll<HTMLImageElement>('.grid-item-img')

    // Wait for images to be ready
    const initTimelines = () => {
      const ctx = gsap.context(() => {
        items.forEach((item, index) => {
          const img = images[index]
          if (!img) return

          const isEven = index % 2 === 0

          gsap.set(img, {
            transformStyle: 'preserve-3d',
            transformOrigin: isEven ? '0% 100%' : '100% 0%',
            backfaceVisibility: 'hidden',
          })

          if (isEven) {
            gsap.timeline({
              scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }).fromTo(img,
              { rotationX: 70, scaleY: 0.8, scaleX: 1.1, filter: 'brightness(200%)' },
              { rotationX: -50, scaleY: 0.8, scaleX: 1.1, filter: 'brightness(0%)' }
            )
          } else {
            gsap.timeline({
              scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }).fromTo(img,
              { rotationX: -50, scaleY: 0.8, scaleX: 1.1, filter: 'brightness(0%)' },
              { rotationX: 70, scaleY: 0.8, scaleX: 1.1, filter: 'brightness(200%)' }
            )
          }
        })
      }, gridRef)

      return ctx
    }

    // Simple load check
    const allImgs = Array.from(images)
    let loaded = 0
    const total = allImgs.length

    const checkReady = () => {
      loaded++
      if (loaded >= total) {
        ScrollTrigger.refresh()
      }
    }

    allImgs.forEach(img => {
      if (img.complete) {
        checkReady()
      } else {
        img.addEventListener('load', checkReady, { once: true })
        img.addEventListener('error', checkReady, { once: true })
      }
    })

    const ctx = initTimelines()

    return () => {
      ctx?.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="collection"
      className="w-full bg-milk py-24 lg:py-[120px]"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <h2 className="font-editorial text-[clamp(28px,3vw,48px)] text-muted-navy text-center mb-20">
          The Collection
        </h2>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          style={{ perspective: '1000px' }}
        >
          {gridItems.map((item, i) => (
            <div
              key={i}
              className="grid-item overflow-hidden cursor-pointer group"
              style={{ borderRadius: '2px' }}
              onClick={() => navigate('/product')}
            >
              <img
                src={item.asset}
                alt={`Collection item ${i + 1}`}
                className="grid-item-img w-full object-cover group-hover:scale-[1.02] transition-transform duration-400"
                style={{ aspectRatio: item.aspect, borderRadius: '2px' }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
