import type { Meta, StoryObj } from '@storybook/react';
import { NavigationPillList } from '@dp/ui';

const meta: Meta<typeof NavigationPillList> = {
  title: 'Components/NavigationPillList',
  component: NavigationPillList,
  args: { children: 'NavigationPillList' },
  argTypes: {
    direction: { control: 'select', options: ['row', 'column'] }
  },
};

export default meta;
type Story = StoryObj<typeof NavigationPillList>;

export const Default: Story = {};
export const DirectionRow: Story = { args: { direction: 'row' } };
export const DirectionColumn: Story = { args: { direction: 'column' } };

