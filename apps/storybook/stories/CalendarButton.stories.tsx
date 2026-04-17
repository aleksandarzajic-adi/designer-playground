import type { Meta, StoryObj } from '@storybook/react';
import { CalendarButton } from '@dp/ui';

const meta: Meta<typeof CalendarButton> = {
  title: 'Components/CalendarButton',
  component: CalendarButton,
  args: { children: 'CalendarButton' },
  argTypes: {
    disabled: { control: 'boolean' }
  },
};

export default meta;
type Story = StoryObj<typeof CalendarButton>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
