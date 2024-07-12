import type { Meta, StoryObj } from '@storybook/vue3'
import FormItemsBuilder from '@/components/common/FormItemsBuilder/index.vue'
import FormItemsBuilderDemo1 from '@/components/common/FormItemsBuilder/demos/demo1.vue'
import FormItemsBuilderDemo2 from '@/components/common/FormItemsBuilder/demos/demo2.vue'
import FormItemsBuilderDemo3 from '@/components/common/FormItemsBuilder/demos/demo3.vue'
import FormItemsBuilderDemo4 from '@/components/common/FormItemsBuilder/demos/demo4.vue'
// import * as readme from '@/components/common/FormItemsBuilder/README.md?raw'

const meta = {
  title: 'Common/FormItemsBuilder',
  component: FormItemsBuilder,
  parameters: {
    // https://storybook.js.org/docs/vue/configure/story-layout
    layout: 'fullscreen',
    docs: {
      description: {
        // component: `${readme.default}`,
      },
    },
  },
  // https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof FormItemsBuilder>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => ({
    components: { FormItemsBuilderDemo1 },
    template: '<FormItemsBuilderDemo1 />',
  }),
}

export const Demo2: Story = {
  render: () => ({
    components: { FormItemsBuilderDemo2 },
    template: '<FormItemsBuilderDemo2 />',
  }),
}

export const Demo3: Story = {
  render: () => ({
    components: { FormItemsBuilderDemo3 },
    template: '<FormItemsBuilderDemo3 />',
  }),
}

export const Demo4: Story = {
  render: () => ({
    components: { FormItemsBuilderDemo4 },
    template: '<FormItemsBuilderDemo4 />',
  }),
}
