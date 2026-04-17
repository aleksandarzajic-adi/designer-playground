import type { Meta, StoryObj } from '@storybook/react';
import { AccordionItem } from '@dp/ui';

const meta: Meta<typeof AccordionItem> = {
  title: 'Components/AccordionItem',
  component: AccordionItem,
  args: { children: 'AccordionItem' },
};

export default meta;
type Story = StoryObj<typeof AccordionItem>;

export const Default: Story = {};


