'use client'
import { useRowLabel } from '@payloadcms/ui'
import React, { useEffect, useState } from 'react'

import type { OptionKey, Option } from '../types'

const KeyLabel: React.FC = () => {
  const { data, rowNumber } = useRowLabel<OptionKey>()
  const [label, setLabel] = useState(`Key ${rowNumber}`)

  useEffect(() => {
    if (data.label) {
      const title = `${data.label}`
      const values = data?.values?.map((option: Option) => option.label) ?? []

      const label = `${title} (${values.join(', ')})`
      setLabel(label)
    } else {
      setLabel(`Key ${rowNumber}`)
    }
  }, [data, rowNumber])

  return (
    <div>
      <span>{label}</span>
    </div>
  )
}

export default KeyLabel