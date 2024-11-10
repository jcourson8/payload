import type { Product } from '@/payload-types'

// Get the non-null types from the Product interface
type NonNullVariants = NonNullable<Product['variants']>
export type NonNullOptions = NonNullable<NonNullVariants['options']>
type NonNullVariantsList = NonNullable<NonNullVariants['variants']>

export type OptionKey = NonNullOptions[number]
export type Option = NonNullable<OptionKey['values']>[number]
export type ProductVariant = NonNullVariantsList[number] & {
  options: string[]
}

export type KeysFieldValue = {
  options: (Option & { key: OptionKey })[]
}

export interface RadioGroupProps {
  /**
   * Required for sorting the array
   */
  fullArray: NonNullOptions
  group: OptionKey
  options: Option[]
  path: string
  setValue: (value: string[]) => void
  value: string[]
}

export type InfoType = {
  options: {
    key: {
      label: OptionKey['label']
      slug: OptionKey['slug']
    }
    label: Option['label']
    slug: Option['slug']
  }[]
  price: {
    amount: number
    currency: string
  }
  productName: string
  stock: number
}
