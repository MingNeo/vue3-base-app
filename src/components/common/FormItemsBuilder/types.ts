import type { Ref } from 'vue'
import type dayjs from 'dayjs'

export interface SearchField {
  label?: string
  name: string
  type: string
  component?: any
  fieldProps?: Record<string, any>
  [x: string]: any
}

export interface IGroup {
  label: string
  value: string
  fieldNames: Array<string>
  [x: string]: any
}

export type ValueType = string | number | Date | dayjs.Dayjs | null | undefined | any[] | Record<string, any>

export type DateType = string | number | Date | dayjs.Dayjs | null | undefined

export type FormItemsBuilderFormState<T = Record<string, any>> = T & { [key: string]: any }

export interface FormItemsBuilderField {
  name: string
  type?: string
  label?: string
  labelExtra?: string
  labelTip?: string
  fieldProps?: Record<string, any>
  required?: boolean
  requiredOnlyStyle?: boolean
  viewMode?: boolean
  rules?: any[]
  column?: number
  formItemProps?: Record<string, any>
  on?: Record<string, any>
  hidden?: boolean | ((formState: FormItemsBuilderFormState) => boolean)
  component?: any
  col?: { span?: number, offset?: number, flex?: number, style?: any }
  onChange?: (info: { value: any, formState: Ref<FormItemsBuilderFormState>, originValue: any }, ...args: any[]) => void
  formatPropValue?: (value: any, formState: Ref<FormItemsBuilderFormState>) => any
  customRender?: (value: any, field: FormItemsBuilderField, formState: FormItemsBuilderFormState) => string
  valueKey?: string
  formatChangedValue?: (value: any, formState: FormItemsBuilderFormState) => any
  [x: string]: any
}
