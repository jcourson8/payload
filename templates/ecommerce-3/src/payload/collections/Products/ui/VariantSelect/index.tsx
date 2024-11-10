'use client'
import type { Product } from '@/payload-types'
import type { TextField } from 'payload'

import { toKebabCase } from '@/utilities/toKebabCase'
import { getTranslation } from '@/utilities/getTranslation'
import { useField, useFieldProps, useForm, useFormFields, useTranslation } from '@payloadcms/ui'
import React, { useCallback } from 'react'
import { sortOptionsByKey } from '@/payload/collections/Products/utilities/sortOptionsByKey'

import type { InfoType, RadioGroupProps, OptionKey, Option, NonNullOptions } from '../types'

import classes from './index.module.scss'

const VariantSelect: React.FC<TextField> = (props) => {
  const { label } = props
  const { path } = useFieldProps()
  const { setValue, value } = useField<string[]>({ path })
  const [variantPath] = path.split(/\.(?=[^.]+$)/)
  const { getDataByPath } = useForm()
  const variantInfoPath = path.includes('.') ? variantPath + '.info' : 'info'

  const keys: OptionKey[] = getDataByPath('variants.options') || []

  const { dispatchFields, infoField } = useFormFields(([fields, dispatchFields]) => ({
    dispatchFields,
    infoField: fields[variantInfoPath],
  }))

  const variantInfo = infoField.value

  const { i18n } = useTranslation()

  const handleUpdate = useCallback(
    (newValue: string[]) => {
      const options: InfoType['options'] = []

      newValue.forEach((value: string) => {
        keys.forEach((group: OptionKey) => {
          if (group.values) {
            group.values.forEach((option: Option) => {
              if (option.slug === value) {
                options.push({
                  slug: option.slug,
                  key: {
                    slug: group.slug,
                    label: group.label,
                  },
                  label: option.label,
                })
              }
            })
          }
        })
      })

      const existingVariantInfo = variantInfo ? (variantInfo as InfoType) : {}

      const newVariantInfo: Partial<InfoType> = {
        ...existingVariantInfo,
        options,
      }

      dispatchFields({
        type: 'UPDATE',
        path: variantInfoPath,
        value: newVariantInfo,
      })

      setValue(newValue)
    },
    [variantInfo, dispatchFields, variantInfoPath, setValue, keys],
  )

  return (
    <div className={classes.container}>
      <p style={{ marginBottom: '0' }}>{typeof label === 'string' ? label : 'Product'}</p>
      <div className={classes.groupsContainer}>
        {keys.length > 0 &&
          keys.map((key: OptionKey) => {
            if (!key.values) return null

            return (
              <div className={classes.group} key={toKebabCase(key.slug)}>
                <div className={classes.groupLabel}>
                  {getTranslation(key.label, i18n)}{' '}
                  <span className={classes.requiredIndicator}>*</span>
                </div>
                <div className={classes.groupItems}>
                  <RadioGroup
                    fullArray={keys}
                    group={key}
                    options={key.values}
                    path={path}
                    setValue={handleUpdate}
                    value={value || []}
                  />
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  fullArray,
  group,
  options,
  path,
  setValue,
  value,
}) => {
  const { i18n } = useTranslation()

  const handleOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const filteredValues =
        value?.filter((value) => {
          const isIncluded = options.find((option) => option.slug === value)

          return !isIncluded
        }) ?? []

      const newValue = [...filteredValues, e.target.value]

      const sortedValues = sortOptionsByKey(newValue, fullArray)

      setValue(sortedValues)
    },
    [options, value, setValue, fullArray],
  )

  return (
    <React.Fragment>
      {options.map((item) => {
        const id = `${path}_${item.slug}`
        const name = `${path}_${group.slug}`

        return (
          <div className={classes.fieldItem} key={id}>
            <input
              defaultChecked={value && Array.isArray(value) && value?.includes(item.slug)}
              id={id}
              name={name}
              onChange={handleOnChange}
              required
              type="radio"
              value={item.slug}
            />
            <label htmlFor={id}>{getTranslation(item.label, i18n)} </label>
          </div>
        )
      })}
    </React.Fragment>
  )
}

export default VariantSelect
