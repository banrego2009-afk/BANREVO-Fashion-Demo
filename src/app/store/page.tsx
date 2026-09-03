import { Metadata } from 'next'
import { brand } from '@/config/brand.config'
import Link from 'next/link'

export const metadata: Metadata = {
  title: `Online Üzlet | ${brand.name}`,
  description: 'A teljes kollekció, a méretválasztás és az online rendelés hamarosan elérhető lesz.',
}

export default function StorePage() {
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-ivory via-cream to-stone/20" />
        {/* Subtle moving textile pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 20px,
              currentColor 20px,
              currentColor 21px
            )`,
            animation: 'subtle-drift 60s linear infinite',
          }}
        />
        {/* Soft garment silhouette */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-[500px] h-[700px] opacity-[0.04]">
          <svg viewBox="0 0 400 600" className="w-full h-full text-champagne">
            <path
              d="M200 80 Q160 80 150 120 L130 200 Q120 240 140 260 L120 500 Q120 540 180 540 L220 540 Q280 540 280 500 L260 260 Q280 240 270 200 L250 120 Q240 80 200 80Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-lg mx-auto px-6">
        <span className="text-xs uppercase tracking-[0.4em] text-champagne">
          Online Store
        </span>

        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-graphite mt-6 mb-6">
          Az online üzlet készülőben van.
        </h1>

        <p className="text-graphite/60 leading-relaxed mb-10">
          A teljes kollekció, a méretválasztás és az online rendelés hamarosan elérhető lesz.
        </p>

        <Link
          href="/"
          className="inline-block border border-graphite text-graphite px-8 py-3 text-sm uppercase tracking-wider hover:bg-graphite hover:text-ivory transition-colors duration-300"
        >
          Vissza a bemutatóhoz
        </Link>
      </div>

      <style>{`
        @keyframes subtle-drift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(30px, 30px); }
        }
      `}</style>
    </main>
  )
}
