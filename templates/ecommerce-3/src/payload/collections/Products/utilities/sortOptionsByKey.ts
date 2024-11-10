import type { OptionKey } from '../ui/types'

export function sortOptionsByKey(options: string[], keys: OptionKey[]): string[] {
  return options.sort((a, b) => {
    const aIndex = keys.findIndex((group) => {
      if (!group.values) return false
      return group.values.some((option) => option.slug === a)
    })

    const bIndex = keys.findIndex((group) => {
      if (!group.values) return false
      return group.values.some((option) => option.slug === b)
    })

    return aIndex - bIndex
  })
}