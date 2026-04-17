import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from '@dp/ui';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  args: { children: 'Tooltip' },
  argTypes: {
    placement: { control: 'select', options: ['top', 'left', 'right', 'bottom'] }
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {};
export const PlacementTop: Story = { args: { placement: 'top' } };
export const PlacementLeft: Story = { args: { placement: 'left' } };
export const PlacementRight: Story = { args: { placement: 'right' } };
export const PlacementBottom: Story = { args: { placement: 'bottom' } };

