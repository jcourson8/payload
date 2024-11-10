import type { Product } from '@/payload-types'
import type { StripeWebhookHandler } from '@payloadcms/plugin-stripe/types'
import type Stripe from 'stripe'

import type { InfoType } from '../../collections/Products/ui/types'

const logs = false

export const productUpdated: StripeWebhookHandler<{
  data: {
    object: Stripe.Product
  }
}> = async ({ event, payload, stripe }) => {
  const {
    id: stripeProductID,
    name: stripeProductName,
    default_price: defaultPrice,
  } = event.data.object

  if (logs) payload.logger.info(`Syncing Stripe product with ID: ${stripeProductID} to Payload...`)

  let payloadProductID: string | undefined
  let stripePriceID: string | undefined
  let isVariant = false
  let product: Product | undefined
  let price: Stripe.Price | undefined

  // First lookup the product in Payload
  try {
    if (logs) payload.logger.info(`- Looking up existing Payload product...`)

    const productQuery = await payload.find({
      collection: 'products',
      where: {
        or: [
          {
            stripeProductID: {
              equals: stripeProductID,
            },
          },
          {
            'variants.variants.stripeProductID': {
              equals: stripeProductID,
            },
          },
        ],
      },
    })

    product = productQuery.docs?.[0]
    if (!product) return

    isVariant = Boolean(product.enableVariants && product.variants?.variants?.length)

    if (defaultPrice) {
      stripePriceID = typeof defaultPrice === 'string' ? defaultPrice : defaultPrice.id
    }

    if (!stripePriceID) {
      if (logs) payload.logger.info(`- This product has no default price. Skipping sync for now...`)
      return
    }

    payloadProductID = String(product.id)

    if (payloadProductID) {
      if (logs)
        payload.logger.info(
          `- Found existing product with Stripe ID: ${stripeProductID}, syncing now...`,
        )
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    payload.logger.error(`Error finding product ${message}`)
  }

  // Get price data
  try {
    if (!stripePriceID) return
    price = await stripe.prices.retrieve(stripePriceID)
    if (!price || !product || !payloadProductID) return
  } catch (error: unknown) {
    payload.logger.error(`- Error looking up prices: ${error}`)
    return
  }

  try {
    if (!product?.variants?.variants || !price || !payloadProductID) return

    if (isVariant) {
      const variantIndex = product.variants.variants.findIndex(
        (variant) => variant.stripeProductID === stripeProductID,
      )

      if (variantIndex !== -1) {
        const variant = product.variants.variants[variantIndex]

        const updatedInfo: Partial<InfoType> = {
          ...(typeof variant?.info === 'object' ? variant?.info : {}),
          price: {
            amount: price.unit_amount ?? 0,
            currency: price.currency,
          },
          productName: stripeProductName,
        }

        const updatedVariants = product.variants.variants.map((v, i) => {
          if (i === variantIndex) {
            return {
              ...v,
              info: updatedInfo,
            }
          }
          return v
        })

        await payload.update({
          id: payloadProductID,
          collection: 'products',
          data: {
            skipSync: true,
            variants: {
              variants: updatedVariants,
            },
          },
        } as any)
      }
    } else {
      const updatedInfo: Partial<InfoType> = {
        ...(typeof product?.info === 'object' ? product?.info : {}),
        price: {
          amount: price.unit_amount ?? 0,
          currency: price.currency,
        },
        productName: stripeProductName,
      }

      await payload.update({
        id: payloadProductID,
        collection: 'products',
        data: {
          info: updatedInfo,
          skipSync: true,
        },
      })
    }

    if (logs) payload.logger.info(`✅ Successfully updated product.`)
  } catch (error: unknown) {
    payload.logger.error(`- Error updating product: ${error}`)
  }
}
