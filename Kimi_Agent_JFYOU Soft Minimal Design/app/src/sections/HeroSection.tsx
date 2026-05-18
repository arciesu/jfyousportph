import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 })
    tl.to(headingRef.current, {
      y: 0, opacity: 1, duration: 1.2,
      ease: 'cubic-bezier(0.2, 1, 0.3, 1)',
    })
    tl.to(subRef.current, {
      y: 0, opacity: 1, duration: 1.2,
      ease: 'cubic-bezier(0.2, 1, 0.3, 1)',
    }, '-=0.6')
    tl.to(ctaRef.current, {
      y: 0, opacity: 1, duration: 1.2,
      ease: 'cubic-bezier(0.2, 1, 0.3, 1)',
    }, '-=0.6')
    tl.to(indicatorRef.current, {
      opacity: 1, duration: 0.8,
    }, '-=0.3')

    return () => { tl.kill() }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden"
    >
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        poster="/assets/img-lifestyle-editorial.jpg"
      >
        <source src="/assets/video-hero.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted-navy/20 via-transparent to-muted-navy/30 z-[1]" />

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <h1
          ref={headingRef}
          className="font-editorial text-[clamp(40px,5vw,80px)] text-milk opacity-0 translate-y-[30px]"
          style={{ textShadow: '0 2px 40px rgba(3, 4, 94, 0.15)' }}
        >
          Glow Flow
        </h1>
        <p
          ref={subRef}
          className="font-outfit text-sm font-light tracking-[0.08em] text-milk/85 mt-6 opacity-0 translate-y-[30px]"
        >
          Made for Pilates, Yoga &amp; Everyday Movement
        </p>
        <Link
          ref={ctaRef}
          to="/#collection"
          className="inline-block mt-10 bg-warm-peach text-milk font-mono text-[11px] uppercase tracking-[0.12em] px-10 py-4 rounded-full opacity-0 translate-y-[30px] hover:bg-[#ff9e8e] hover:-translate-y-0.5 transition-all duration-300"
        >
          EXPLORE THE COLLECTION
        </Link>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={indicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 opacity-0"
      >
        <div className="w-px h-10 bg-milk/40 animate-scroll-pulse" />
      </div>
    </section>
  )
}
