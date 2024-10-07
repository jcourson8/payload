import type { MarkOptional } from 'ts-essentials'

import type { ArrayField, ArrayFieldClient } from '../../fields/config/types.js'
import type { ArrayFieldValidation } from '../../fields/validations.js'
import type { FieldErrorClientComponent, FieldErrorServerComponent } from '../forms/Error.js'
import type {
  ClientFieldBase,
  FieldClientComponent,
  FieldServerComponent,
  ServerFieldBase,
} from '../forms/Field.js'
import type {
  FieldDescriptionClientComponent,
  FieldDescriptionServerComponent,
  FieldLabelClientComponent,
  FieldLabelServerComponent,
} from '../types.js'

type ArrayFieldClientWithoutType = MarkOptional<ArrayFieldClient, 'type'>

type ArrayFieldBaseClientProps = {
  readonly CustomRowLabel?: React.ReactNode
  readonly Fields?: React.ReactNode[][]
  readonly validate?: ArrayFieldValidation
}

export type ArrayFieldClientProps = ArrayFieldBaseClientProps &
  ClientFieldBase<ArrayFieldClientWithoutType>

export type ArrayFieldServerProps = ServerFieldBase<ArrayField, ArrayFieldClientWithoutType>

export type ArrayFieldServerComponent = FieldServerComponent<
  ArrayField,
  ArrayFieldClientWithoutType
>

export type ArrayFieldClientComponent = FieldClientComponent<
  ArrayFieldClientWithoutType,
  ArrayFieldBaseClientProps
>

export type ArrayFieldLabelServerComponent = FieldLabelServerComponent<
  ArrayField,
  ArrayFieldClientWithoutType
>

export type ArrayFieldLabelClientComponent = FieldLabelClientComponent<ArrayFieldClientWithoutType>

export type ArrayFieldDescriptionServerComponent = FieldDescriptionServerComponent<
  ArrayField,
  ArrayFieldClientWithoutType
>

export type ArrayFieldDescriptionClientComponent =
  FieldDescriptionClientComponent<ArrayFieldClientWithoutType>

export type ArrayFieldErrorServerComponent = FieldErrorServerComponent<
  ArrayField,
  ArrayFieldClientWithoutType
>

export type ArrayFieldErrorClientComponent = FieldErrorClientComponent<ArrayFieldClientWithoutType>