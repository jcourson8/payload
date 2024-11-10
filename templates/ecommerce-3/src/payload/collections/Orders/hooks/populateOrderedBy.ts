import { FieldHook } from 'payload'
import type { Order, User } from '../../../../payload-types'

export const populateOrderedBy: FieldHook<Order> = async ({ operation, req, value }) => {
  if ((operation === 'create' || operation === 'update') && !value) {
    return (req.user as User).id
  }

  return value
}
