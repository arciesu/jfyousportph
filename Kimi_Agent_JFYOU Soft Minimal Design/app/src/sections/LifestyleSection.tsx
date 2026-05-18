import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function LifestyleSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLParagraphElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(imageRef.current,
        { scale: 1.05, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 1.4,
          ease: 'cubic-bezier(0.2, 1, 0.3, 1)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      )

      gsap.fromTo(headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1,
          delay: 0.2,
          ease: 'cubic-bezier(0.2, 1, 0.3, 1)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      )

      gsap.fromTo(bodyRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1,
          delay: 0.4,
          ease: 'cubic-bezier(0.2, 1, 0.3, 1)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      )

      gsap.fromTo(labelRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1,
          delay: 0.6,
          ease: 'cubic-bezier(0.2, 1, 0.3, 1)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="w-full bg-milk py-24 lg:py-[120px]"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10">
          {/* Image Column */}
          <div className="overflow-hidden" style={{ borderRadius: '2px' }}>
            <img
              ref={imageRef}
              src="/assets/img-lifestyle-editorial.jpg"
              alt="Woman in yoga pose with matcha"
              className="w-full h-[50vh] lg:h-[80vh] object-cover opacity-0"
              style={{ borderRadius: '2px' }}
            />
          </div>

          {/* Text Column */}
          <div className="flex items-center lg:sticky lg:top-1/2 lg:-translate-y-1/2 py-8 lg:py-0 lg:px-[60px]">
            <div>
              <h2
                ref={headingRef}
                className="font-editorial italic text-[clamp(32px,3.5vw,56px)] text-muted-navy leading-tight opacity-0 lg:-ml-20 relative z-[2]"
              >
                The Quiet Power of Movement
              </h2>
              <p
                ref={bodyRef}
                className="font-outfit text-base font-light text-muted-navy/70 leading-[1.7] mt-8 max-w-[420px] opacity-0"
              >
                JFYOU is designed for the modern girl who moves softly through her day — from morning pilates to afternoon matcha runs. Each piece is crafted from breathable, buttery-soft fabrics that feel like a second skin.
              </p>
              <span
                ref={labelRef}
                className="inline-block font-mono text-[10px] uppercase tracking-[0.15em] text-muted-navy/35 mt-12 opacity-0"
              >
                EST. 2024 — MANILA
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
