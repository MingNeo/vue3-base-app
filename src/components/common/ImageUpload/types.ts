export interface ImageUploadProps {
  value?: string | string[]
  maxLength?: number
  multiple?: boolean
  readonly?: boolean
  action?: string
  name?: string
  accept?: string
  limitSize?: number
}
