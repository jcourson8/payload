import type { InfoType } from '@/payload/collections/Products/ui/types'
import type { CartItems } from '@/payload-types'

import Price from '@/components/price'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface Props {
  items: CartItems
}

// Add type for variant
interface Variant {
  id: string
  info?: InfoType
  images?: Array<{
    image?: Media | null
  }>
}

interface Media {
  alt?: string
  url: string
}

// Helper function to type guard Media objects
function isMedia(value: any): value is Media {
  return value && typeof value === 'object' && typeof value.url === 'string'
}

export const ItemsList: React.FC<Props> = ({ items }) => {
  return (
    <ul className="flex-grow overflow-auto py-4">
      {items?.map((item, i) => {
        if (
          typeof item.product === 'string' ||
          !item ||
          !item.product ||
          typeof item.product === 'number'
        ) {
          return <React.Fragment key={item.id} />
        }

        const product = item.product
        let image: Media | undefined

        // Safely type narrow the image
        const metaImage = product?.meta?.image
        if (isMedia(metaImage)) {
          image = metaImage
        }

        const isVariant = Boolean(item.variant)
        // Type assertion for variants array
        const variant = product?.variants?.variants?.length
          ? (product.variants.variants as Variant[]).find((v) => v.id === item.variant)
          : undefined

        const info = isVariant ? (variant?.info as InfoType) : (product?.info as InfoType)

        if (isVariant && variant) {
          const variantImage = variant.images?.[0]?.image
          if (isMedia(variantImage)) {
            image = variantImage
          }
        }

        const url = `/product/${product?.slug}${isVariant ? `?variant=${item.variant}` : ''}`

        return (
          <li
            className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700"
            key={item.id}
          >
            <div className="relative flex w-full flex-row justify-between px-1 py-4">
              <Link className="z-30 flex flex-row space-x-4" href={url}>
                <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                  <Image
                    alt={image?.alt || product.title}
                    className="h-full w-full object-cover"
                    height={64}
                    src={image?.url || ''}
                    width={64}
                  />
                </div>

                <div className="flex flex-1 flex-col text-base">
                  <span className="leading-tight">{product.title}</span>
                  {isVariant && info.options?.length ? (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {info.options
                        ?.map((option) => {
                          return option.label
                        })
                        .join(', ')}
                    </p>
                  ) : null}
                </div>
              </Link>
              <div className="flex h-16 flex-col justify-between">
                {info?.price && (
                  <Price
                    amount={info.price?.amount}
                    className="flex justify-end space-y-2 text-right text-sm"
                    currencyCode={info.price?.currency}
                  />
                )}
                <p>{item.quantity}</p>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
