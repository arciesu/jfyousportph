import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ShoppingBag } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top -100vh',
      onUpdate: (self) => {
        setScrolled(self.progress > 0)
      },
    })
    return () => { trigger.kill() }
  }, [])

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-8 lg:px-12 transition-all duration-400"
      style={{
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        backgroundColor: scrolled ? 'rgba(253, 252, 248, 0.8)' : 'transparent',
      }}
    >
      <Link
        to="/"
        className="font-mono text-sm uppercase tracking-[0.15em] text-muted-navy"
      >
        JFYOU
      </Link>

      <div className="flex items-center gap-8">
        <div className="hidden md:flex items-center gap-8">
          {['SHOP', 'JOURNAL', 'ABOUT'].map((label) => (
            <Link
              key={label}
              to="/"
              className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-navy hover:opacity-50 transition-opacity duration-300"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button className="text-muted-navy hover:opacity-50 transition-opacity duration-300">
            <Search size={18} strokeWidth={1.5} />
          </button>
          <button className="text-muted-navy hover:opacity-50 transition-opacity duration-300 relative">
            <ShoppingBag size={18} strokeWidth={1.5} />
            <span className="absolute -top-0.5 -right-0.5 w-1 h-1 rounded-full bg-warm-peach" />
          </button>
        </div>
      </div>
    </nav>
  )
}
