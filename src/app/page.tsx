import { Metadata } from 'next'
import { brand } from '@/config/brand.config'
import { rackProducts, collectionProducts, accessoryProducts } from '@/data/products'
import HeroSection from '@/components/sections/HeroSection'
import CarouselSection from '@/components/sections/CarouselSection'
import ProductRowSection from '@/components/sections/ProductRowSection'
import AboutSection from '@/components/sections/AboutSection'
import CtaSection from '@/components/sections/CtaSection'

export const metadata: Metadata = {
  title: `${brand.name} | ${brand.tagline}`,
  description: `Tíz női darab. Egy könnyed, kortárs kollekció, amely minden nézőpontból felfedezhető. — ${brand.name}`,
}

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <CarouselSection products={rackProducts} />
      <section id="women">
        <ProductRowSection
          title="A kollekció további darabjai"
          products={collectionProducts}
        />
      </section>
      <section id="accessories">
        <ProductRowSection
          title="Cipők és kiegészítők"
          products={accessoryProducts}
        />
      </section>
      <AboutSection />
      <CtaSection />
    </main>
  )
}
