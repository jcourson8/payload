import type { Product } from '@/payload-types'
import type { Media } from '@/payload-types'

import Grid from '@/components/grid'
import { GridTileImage } from '@/components/grid/tile'
import Link from 'next/link'
import React from 'react'

// Helper function to type guard Media objects
function isMedia(value: any): value is Media {
  return value && typeof value === 'object' && typeof value.url === 'string'
}

export default function ProductGridItems({ products }: { products: Product[] }) {
  return (
    <React.Fragment>
      {products.map((product) => {
        const productImage = product.meta?.image
        const image = isMedia(productImage) ? productImage : undefined

        if (!image) return null

        // Ensure all required properties are available
        if (!product.price || !product.currency || !product.title) return null

        return (
          <Grid.Item className="animate-fadeIn" key={product.id}>
            <Link className="relative inline-block h-full w-full" href={`/product/${product.slug}`}>
              <GridTileImage
                label={{
                  amount: product.price,
                  currencyCode: product.currency,
                  title: product.title,
                }}
                media={image}
              />
            </Link>
          </Grid.Item>
        )
      })}
    </React.Fragment>
  )
}
