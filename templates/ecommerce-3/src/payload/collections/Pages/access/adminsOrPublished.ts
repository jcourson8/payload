import type { Access } from 'payload'

import { checkRole } from '../../Users/checkRole'

export const adminsOrPublished: Access = ({ req: { user } }) => {
  if (checkRole(['admin'], user ?? undefined)) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}
