import { Metadata } from 'next'
import { brand } from '@/config/brand.config'
import { getDetailProducts, getProductBySlug } from '@/data/products'
import { notFound } from 'next/navigation'
import ProductDetail from '@/components/product/ProductDetail'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getDetailProducts().map((product) => ({
    slug: product.slug,
  }))
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    return { title: `Termék nem található | ${brand.name}` }
  }

  return {
    title: `${product.name} | ${brand.name}`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | ${brand.name}`,
      description: product.shortDescription,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product || !product.detailAvailable) {
    notFound()
  }

  return (
    <main className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <ProductDetail product={product} />
      </div>
    </main>
  )
}
