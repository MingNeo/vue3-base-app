<script lang="ts" setup>
import dayjs from 'dayjs'
import type { DateType, FormItemsBuilderField, FormItemsBuilderFormState, ValueType } from './types'

const props = withDefaults(defineProps<{
  // field 类型
  fields: FormItemsBuilderField[]
  modelValue?: FormItemsBuilderFormState
  column?: number
  viewMode?: boolean
  namePrefix?: (string | number)[]
  formItemProps?: Record<string, any>
}>(), { column: 3 })

const emit = defineEmits(['update:modelValue', 'change'])

const formState = ref<FormItemsBuilderFormState>(props.modelValue ?? {})

const fields = computed(() => props.fields.filter(v => typeof v?.hidden === 'function' ? !v.hidden(formState.value) : !v?.hidden))
const hiddenFields = computed(() => props.fields.filter(v => typeof v?.hidden === 'function' ? v.hidden(formState.value) : v?.hidden))

watch(() => props.modelValue, val => (formState.value = val || {}), { deep: true })

function onFieldChange({ name, formatChangedValue, onChange }: FormItemsBuilderField, value: any, ...args: any) {
  const formatedValue = formatChangedValue ? formatChangedValue(value, formState.value) : value
  formState.value[name] = formatedValue
  try {
    onChange?.({ value: formatedValue, originValue: value, formState }, ...args)
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.log('form field onChange error', error)
  }
  emit('update:modelValue', formState.value)
  emit('change', formState.value)
}

const formItems = computed(() => {
  return fields.value.map((item) => {
    const { name, label, type = '', required } = item
    const colSpan = item.col?.span || getFormItemCol(item.column || props.column, item.col?.span)
    const itemRules = getRulesForColumn(item)
    const itemValue = formState.value[name]
    const itemProps = getformItemProps(item.formItemProps, props.formItemProps)
    const itemPlaceholder = getPlaceholder(type, label)
    // const itemValueView = renderView(itemValue, item, formState.value)

    return {
      ...item,
      required,
      rules: itemRules,
      fieldProps: getFormFieldProps(item, itemValue, formState.value),
      colSpan,
      itemValue,
      itemProps,
      placeholder: itemPlaceholder,
    }
  })
})
</script>

<script lang="ts">
const placeholderMap: Record<string, any> = {
  select: '请选择',
  datePicker: '请选择',
  timePicker: '请选择',
  cascader: '请选择',
  treeSelect: '请选择',
  component: '请选择',
  number: '请输入',
  textarea: '请输入',
}

function getRulesForColumn(item: any) {
  const rules = [...(item.rules || [])]
  if (item.required)
    rules.push({ required: true, message: `${item.label || item.title || ''}不能为空！` })

  if ((!item.type || item.type === 'input') && item.maxlength)
    rules.push({ max: item.maxlength, message: `${item.label}不能超过${item.maxlength}个字符！` })

  return rules
}

function renderView(val: ValueType, field: FormItemsBuilderField, formState?: FormItemsBuilderFormState) {
  if (field.type === 'checkbox' || (field.type === 'select' && field.fieldProps?.mode === 'multiple'))
    return Array.isArray(val) ? (field?.fieldProps?.options?.filter?.((v: any) => val.includes(v.value)).map((v: any) => v.label).join(', ') || '') : ''
  if (['select', 'radio', 'checkbox'].includes(field.type || 'input'))
    return field?.fieldProps?.options?.find?.((v: any) => v.value === val)?.label || val || ''
  if (field.type === 'datePicker')
    return val ? dayjs(val as DateType).format(field?.fieldProps?.valueFormat || 'YYYY-MM-DD') : ''
  if (field.type === 'rangePicker')
    return val ? (val as string[]).map(item => dayjs(item).format(field?.fieldProps?.valueFormat || 'YYYY-MM-DD')).join('至') : ''
  if (field.type === 'cascader')
    return val ? (val as string[]).join('；') : ''
  return val ?? ''
}

/**
 * 获取表单item的name值，正常情况下不需要，但如果层级较深则需要以此来绑定正确的name值
 */
function getItemName(name: any, namePrefix?: any[]) {
  return namePrefix ? [...namePrefix, name] : name
}

function getformItemProps(options: any = {}, globalOptions: any = {}) {
  return { ...globalOptions, ...options }
}

function getFormItemCol(column = 1, itemColSpan?: number) {
  return itemColSpan || { 1: 24, 2: 12, 3: 8, 4: 6, 6: 4, 8: 3 }[column] || 24
}

function getFormFieldProps(item: FormItemsBuilderField, value: any, formState: FormItemsBuilderFormState) {
  if (typeof item.fieldProps === 'function')
    return item.fieldProps({ value, item, formState }) || {}

  const fieldProps = item.fieldProps || {}
  if (item.type === 'component' && item.valueKey)
    fieldProps[item.valueKey] = value

  if (item.type === 'datePicker') {
    switch (fieldProps.type) {
      case 'datetimerange':
      case 'daterange':
        fieldProps.defaultTime = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]
        break
    }
  }

  return fieldProps
}

function getPlaceholder(type: string, label?: string) {
  return `${placeholderMap[type] || '请输入'}${label || ''}`
}
</script>

<template>
  <div class="base-form-items-builder" :class="{ 'view-mode': viewMode }">
    <el-form-item
      v-for="item in hiddenFields" :key="item.name" v-model="formState[item.name]" hidden
      :name="getItemName(item.name, props.namePrefix)"
    />
    <el-row :gutter="24">
      <el-col
        v-for="(item) in formItems" :key="item.name" v-bind="item.col || {}"
        :span="item.colSpan"
      >
        <template v-if="item.type === 'actions'">
          <component
            :is="item.component" v-bind="item.fieldProps"
            v-on="item.on || {}"
          />
        </template>
        <el-form-item
          v-else :prop="getItemName(item.name, props.namePrefix)"
          :label="(!item.labelExtra && !item.labelTip) ? item.label : undefined" :rules="getRulesForColumn(item)"
          v-bind="item.itemProps"
        >
          <template v-if="item.labelExtra || item.labelTip" #label>
            {{ item.label }}
            <span v-if="item.labelExtra" class="form-item-label-extra">（{{ item.labelExtra }}）</span>
            <el-tooltip v-if="item.labelTip" placement="top">
              <template #title>
                {{ item.labelTip }}
              </template>
              <CommonIcon type="bangzhuhelp-96444ckf" style="margin-left: 2px;" />
            </el-tooltip>
          </template>
          <template v-if="(viewMode || item.viewMode) && item.type === 'component' && item.customRender">
            <slot name="fieldView" :field="item" :record="formState" :text="formState[item.name]">
              <div class="break-all">
                {{ item.customRender(formState[item.name], item, formState) }}
              </div>
            </slot>
          </template>
          <template v-else-if="(viewMode || item.viewMode) && item.type !== 'component'">
            <slot name="fieldView" :field="item" :record="formState" :text="formState[item.name]">
              <div v-if="item.customRender" class="break-all">
                {{ item.customRender(formState[item.name], item, formState) }}
              </div>
              <div v-else-if="item.type === 'upload'">
                <common-origin-upload :file-list="formState[item.name]" readonly />
                <!-- <a v-for="(_value, _index) in formState[item.name]" :key="_index" class="m-r-8px" :href="_value.url">{{ _value.name }}</a> -->
              </div>
              <div v-else class="break-all">
                {{ renderView(formState[item.name], item, formState) }}
              </div>
            </slot>
          </template>
          <template v-else-if="item.type === 'text'">
            <div class="break-all">
              {{ item.customRender ? item.customRender(formState[item.name], item, formState) : formState[item.name] }}
            </div>
          </template>
          <template v-else-if="item.type === 'select'">
            <el-select
              :model-value="formState[item.name]" :placeholder="item.placeholder"
              v-bind="item.fieldProps"
              @change="(val: any, ...args: any[]) => onFieldChange(item, val, ...args)" v-on="item.on || {}"
            >
              <el-option
                v-for="cur in item.fieldProps?.options || []"
                :key="cur.value"
                v-bind="cur"
              />
            </el-select>
          </template>
          <template v-else-if="item.type === 'rate'">
            <el-rate
              :model-value="formState[item.name]" v-bind="item.fieldProps"
              @update:model-value="(val: any) => onFieldChange(item, val)" v-on="item.on || {}"
            />
          </template>
          <template v-else-if="item.type === 'radio'">
            <el-radio-group
              :model-value="formState[item.name]"
              v-bind="item.fieldProps"
              @update:model-value="(val) => onFieldChange(item, val)" v-on="item.on || {}"
            >
              <el-radio v-for="cur in item.fieldProps?.options || []" :key="cur.value" v-bind="cur">
                {{ cur.label }}
              </el-radio>
            </el-radio-group>
          </template>
          <template v-else-if="item.type === 'checkbox'">
            <el-checkbox-group
              :model-value="formState[item.name]"
              v-bind="item.fieldProps"
              @update:model-value="(val) => onFieldChange(item, val)" v-on="item.on || {}"
            >
              <el-checkbox v-for="cur in item.fieldProps?.options || []" :key="cur.value" v-bind="cur">
                {{ cur.label }}
              </el-checkbox>
            </el-checkbox-group>
          </template>
          <template v-else-if="item.type === 'datePicker'">
            <el-date-picker
              :model-value="formState[item.name] ? dayjs(formState[item.name]) : ''"
              :format="item.fieldProps?.format || 'YYYY-MM-DD'" :placeholder="item.placeholder"
              v-bind="item.fieldProps"
              @update:model-value="(value) => onFieldChange(item, value ? (item.fieldProps?.valueFormat ? dayjs(value).format(item.fieldProps?.valueFormat) : dayjs(value).valueOf()) : '')"
            />
          </template>
          <template v-else-if="item.type === 'rangePicker'">
            <el-date-picker
              type="daterange"
              :model-value="formState[item.name] ? formState[item.name].map((v: any) => dayjs(v)) : []"
              :format="item.fieldProps?.format || 'YYYY-MM-DD'"
              v-bind="item.fieldProps"
              @update:model-value="(value) => onFieldChange(item, value)"
            />
          </template>
          <template v-else-if="item.type === 'timePicker'">
            <el-time-picker
              :model-value="formState[item.name]" :placeholder="item.placeholder"
              v-bind="item.fieldProps"
              @update:model-value="(val) => onFieldChange(item, val)" v-on="item.on || {}"
            />
          </template>
          <template v-else-if="item.type === 'cascader'">
            <el-cascader
              :model-value="formState[item.name]" :placeholder="item.placeholder"
              v-bind="item.fieldProps"
              @update:model-value="(val) => onFieldChange(item, val)" v-on="item.on || {}"
            />
          </template>
          <template v-else-if="item.type === 'slider'">
            <el-slider
              :model-value="formState[item.name]" v-bind="item.fieldProps"
              @update:model-value="(val) => onFieldChange(item, val)" v-on="item.on || {}"
            />
          </template>
          <template v-else-if="item.type === 'switch'">
            <el-switch
              v-model="formState[item.name]"
              v-bind="item.fieldProps" v-on="item.on || {}"
            />
          </template>
          <template v-else-if="item.type === 'treeSelect'">
            <el-tree-select
              :model-value="formState[item.name]" :placeholder="item.placeholder"
              v-bind="item.fieldProps"
              @change="(val: any, ...args: any[]) => onFieldChange(item, val, ...args)" v-on="item.on || {}"
            />
          </template>
          <template v-else-if="item.type === 'number'">
            <el-input-number
              :model-value="formState[item.name]" :placeholder="item.placeholder"
              v-bind="item.fieldProps"
              @update:model-value="(val) => onFieldChange(item, val)" v-on="item.on || {}"
            />
          </template>
          <template v-else-if="item.type === 'textarea'">
            <el-input
              type="textarea"
              :model-value="formState[item.name]" :placeholder="item.placeholder"
              v-bind="item.fieldProps"
              @update:model-value="(val) => onFieldChange(item, val)" v-on="item.on || {}"
            />
          </template>
          <template v-else-if="item.type === 'upload'">
            <common-upload
              :files="formState[item.name]"
              v-bind="item.fieldProps"
              @update:files="(val) => onFieldChange(item, val)" v-on="item.on || {}"
            />
          </template>
          <template v-else-if="item.type === 'component'">
            <component
              :is="item.component" :model-value="formState[item.name]"
              :placeholder="item.placeholder"
              v-bind="item.fieldProps"
              :view-mode="viewMode || item.viewMode"
              :readonly="viewMode || item.viewMode"
              @update:model-value="(val: any) => onFieldChange(item, val)"
              @change="(val: any, ...args: any[]) => onFieldChange(item, val, ...args)" v-on="item.on || {}"
            />
          </template>

          <template v-else>
            <el-input
              :model-value="formState[item.name]" :placeholder="getPlaceholder('input', item.label)"
              v-bind="item.fieldProps"
              @update:model-value="(val) => onFieldChange(item, val)" v-on="item.on || {}"
            />
          </template>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
  .clear-btn {
    margin: 0 8px
  }

  .base-form-items-builder {
    &.view-mode {
      padding-bottom: 8px;
    }

    .form-item-label-extra {
      color: #B2B2B2;
    }
  }
</style>

<style lang="scss">
  .base-form-items-builder {
    &.view-mode {
      .el-form-item {
        margin-bottom: 18px;
      }
    }

    .el-form-item__content {
      .el-picker,
      .el-input-number {
        width: 100%;
      }
    }
  }
</style>
