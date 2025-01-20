import type { Meta, StoryObj } from '@storybook/vue3'
import HeaderBar from '@/components/common/HeaderBar/index.vue'

const meta = {
  title: 'Common/HeaderBar',
  component: HeaderBar,
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
} satisfies Meta<typeof HeaderBar>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => ({
    components: { HeaderBar },
    template: '<HeaderBar />',
  }),
}
