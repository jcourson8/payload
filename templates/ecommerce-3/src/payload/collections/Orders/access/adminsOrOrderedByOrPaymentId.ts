import qs from 'qs'
import { ParsedQs } from 'qs'

import { checkRole } from '../../Users/checkRole'
import { Access } from 'payload'
import { User } from '@/payload-types'

/**
 * Access control for Orders based on the user's role and the query string
 */
export const adminsOrOrderedByOrPaymentId: Access = ({ req }) => {
  const typedUser = req.user as User | undefined

  if (checkRole(['admin'], typedUser)) {
    return true
  }

  const searchParams = req.searchParams
  const where = searchParams.get('where')

  const query = where ? qs.parse(where) : {}
  const paymentIntentID = (query.stripePaymentIntentID as ParsedQs)?.equals as string | undefined

  if (paymentIntentID) {
    return {
      and: [
        {
          stripePaymentIntentID: {
            equals: paymentIntentID,
          },
        },
      ],
    }
  }

  if (!typedUser?.id) {
    return false
  }

  return {
    and: [
      {
        orderedBy: {
          equals: typedUser.id,
        },
      },
    ],
  }
}
