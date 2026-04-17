import type { Meta, StoryObj } from '@storybook/react';
import { SliderField } from '@dp/ui';

const meta: Meta<typeof SliderField> = {
  title: 'Components/SliderField',
  component: SliderField,
  args: { children: 'SliderField' },
  argTypes: {
    disabled: { control: 'boolean' }
  },
};

export default meta;
type Story = StoryObj<typeof SliderField>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
