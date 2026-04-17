import type { Meta, StoryObj } from '@storybook/react';
import { NavigationButtonList } from '@dp/ui';

const meta: Meta<typeof NavigationButtonList> = {
  title: 'Components/NavigationButtonList',
  component: NavigationButtonList,
  args: { children: 'NavigationButtonList' },
  argTypes: {
    direction: { control: 'select', options: ['row', 'column'] }
  },
};

export default meta;
type Story = StoryObj<typeof NavigationButtonList>;

export const Default: Story = {};
export const DirectionRow: Story = { args: { direction: 'row' } };
export const DirectionColumn: Story = { args: { direction: 'column' } };

