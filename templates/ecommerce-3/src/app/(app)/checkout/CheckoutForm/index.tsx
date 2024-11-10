'use client'

import type { Order } from '@/payload-types'

import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { useCart } from '@/providers/Cart'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useCallback } from 'react'

export const CheckoutForm: React.FC = () => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = React.useState<null | string>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()
  const { cart, cartTotal, clearCart } = useCart()

  function wait(delay = 500) {
    return new Promise((resolve) => setTimeout(resolve, delay))
  }

  const fetchRetry = useCallback(
    async (url: string, fetchOptions = {}, delay = 750, tries = 3): Promise<any> => {
      function onError(err: Error) {
        const triesLeft = tries - 1
        if (!triesLeft) {
          throw err
        }
        return wait(delay).then(() => fetchRetry(url, fetchOptions, delay, triesLeft))
      }

      return fetch(url, fetchOptions).catch(onError)
    },
    [],
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)

      if (!stripe || !elements) {
        setError('Stripe has not been initialized')
        return
      }

      try {
        const result = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/order-confirmation`,
          },
          redirect: 'if_required',
        })

        if (result.error) {
          setError(result.error.message ?? 'An unknown error occurred')
          setIsLoading(false)
          return
        }

        if (result.paymentIntent?.status === 'succeeded') {
          try {
            const query = new URLSearchParams()

            query.append('limit', '1')
            query.append('depth', '0')
            query.append('where', `[stripePaymentIntentID][equals]=${result.paymentIntent.id}`)

            const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders?${query.toString()}`

            setTimeout(() => {
              fetch(url, {
                credentials: 'include',
                method: 'GET',
              })
                .then((res) => res.json())
                .then((data) => {
                  console.log('received', data, 'for payment', result.paymentIntent)

                  const redirect = `/orders/${data.docs?.[0]?.id}?paymentId=${result.paymentIntent.id}`
                  clearCart()
                  router.push(redirect)
                })
                .catch((err) => {
                  throw new Error(err?.statusText || 'Something went wrong.')
                })
            }, 3000)
          } catch (err) {
            const error = err as Error
            console.error(error.message)
            router.push(`/order-confirmation?error=${encodeURIComponent(error.message)}`)
          }
        }
      } catch (err) {
        const error = err as Error
        setError(`Error while submitting payment: ${error.message}`)
        setIsLoading(false)
      }
    },
    [stripe, elements, fetchRetry, clearCart, router],
  )

  return (
    <form className="'" onSubmit={handleSubmit}>
      {error && <Message error={error} />}
      <PaymentElement />
      <div className="mt-8 flex gap-4">
        <Button asChild variant="outline">
          <Link href="/cart">Back to cart</Link>
        </Button>
        <Button disabled={!stripe || isLoading} type="submit" variant="default">
          {isLoading ? 'Loading...' : 'Pay now'}
        </Button>
      </div>
    </form>
  )
}

export default CheckoutForm
