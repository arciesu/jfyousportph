import { useRef, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { useFluidIcosahedron } from '../hooks/useFluidIcosahedron'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLElement>(null)

  useFluidIcosahedron(canvasContainerRef)

  useEffect(() => {
    if (!footerRef.current) return
    const els = footerRef.current.querySelectorAll('.footer-animate')
    els.forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'cubic-bezier(0.2, 1, 0.3, 1)',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 80%',
          },
        }
      )
    })
  }, [])

  return (
    <footer
      ref={footerRef}
      className="relative w-full min-h-[100dvh] bg-muted-navy overflow-hidden"
    >
      {/* WebGL Canvas */}
      <div
        ref={canvasContainerRef}
        className="absolute inset-0 z-0"
      />

      {/* Footer UI Overlay */}
      <div className="relative z-10 flex flex-col justify-between min-h-[100dvh] max-w-[1440px] mx-auto px-8 lg:px-20 py-16">
        {/* Top Row */}
        <div className="flex items-center justify-between footer-animate">
          <span className="font-mono text-sm text-milk">JFYOU</span>
          <span className="font-editorial italic text-lg text-milk/50">Move Softly</span>
        </div>

        {/* Middle Row — Email Signup */}
        <div className="flex flex-col items-start footer-animate">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-milk/40 mb-4">
            JOIN THE GLOW FLOW
          </span>
          <div className="flex items-center gap-4 w-full max-w-sm">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-transparent border-b border-milk/20 text-milk font-mono text-sm py-3 px-0 placeholder:text-milk/25 focus:outline-none focus:border-warm-peach transition-colors duration-300"
            />
            <button className="text-milk/40 hover:text-warm-peach transition-colors duration-300">
              <ArrowRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Bottom Row — Sitemap */}
        <div className="footer-animate">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-[0.12em] text-milk/60 mb-4">SHOP</h4>
              <ul className="space-y-2">
                {['All Products', 'New Arrivals', 'Bestsellers', 'Sale'].map(link => (
                  <li key={link}>
                    <span className="font-mono text-[11px] text-milk/40 hover:text-milk transition-colors duration-300 cursor-pointer">{link}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-[0.12em] text-milk/60 mb-4">ACTIVITIES</h4>
              <ul className="space-y-2">
                {['Pilates', 'Yoga', 'Gym', 'Running'].map(link => (
                  <li key={link}>
                    <span className="font-mono text-[11px] text-milk/40 hover:text-milk transition-colors duration-300 cursor-pointer">{link}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-[0.12em] text-milk/60 mb-4">COMPANY</h4>
              <ul className="space-y-2">
                {['About', 'Journal', 'Careers', 'Contact'].map(link => (
                  <li key={link}>
                    <span className="font-mono text-[11px] text-milk/40 hover:text-milk transition-colors duration-300 cursor-pointer">{link}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-[0.12em] text-milk/60 mb-4">SUPPORT</h4>
              <ul className="space-y-2">
                {['Shipping', 'Returns', 'Size Guide', 'FAQ'].map(link => (
                  <li key={link}>
                    <span className="font-mono text-[11px] text-milk/40 hover:text-milk transition-colors duration-300 cursor-pointer">{link}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="font-mono text-[10px] text-milk/25">
            &copy; 2024 JFYOU. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
