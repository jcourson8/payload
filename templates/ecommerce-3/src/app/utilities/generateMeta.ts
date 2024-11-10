import type { Metadata } from 'next'

import type { Page, Product } from '../../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'

// eslint-disable-next-line @typescript-eslint/require-await
export const generateMeta = async (args: { doc: Page | Product }): Promise<Metadata> => {
  const { doc } = args || {}

  const ogImage =
    'meta' in doc &&
    typeof doc.meta?.image === 'object' &&
    doc.meta.image !== null &&
    'url' in doc.meta.image &&
    `${process.env.NEXT_PUBLIC_SERVER_URL}${doc.meta.image.url}`

  const title = doc.title
  const description = undefined

  return {
    description,
    openGraph: mergeOpenGraph({
      description,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title: title || 'Payload',
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title: title || 'Payload',
  }
}
