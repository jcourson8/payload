import type { FormField, FormState } from 'payload'

type BlacklistedKeys = 'customComponents' | 'validate'
const blacklistedKeys: BlacklistedKeys[] = ['validate', 'customComponents']

const sanitizeField = (field: FormField): FormField => {
  blacklistedKeys.forEach((key) => {
    field[key] = undefined
  })
  return field
}

/* 
  Takes in FormState and removes fields that are not serializable.
  Returns FormState without blacklisted keys.
**/
export const reduceToSerializableFields = (
  fields: FormState,
): {
  [key: string]: Omit<FormField, BlacklistedKeys>
} => {
  return Object.keys(fields).reduce(
    (acc, key) => {
      acc[key] = sanitizeField(fields[key])
      return acc
    },
    {} as {
      [key: string]: Omit<FormField, BlacklistedKeys>
    },
  )
}