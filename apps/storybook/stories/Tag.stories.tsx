import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from '@dp/ui';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  args: { children: 'Tag' },
  argTypes: {
    scheme: { control: 'select', options: ['brand', 'neutral', 'positive', 'danger', 'warning'] },
    variant: { control: 'select', options: ['primary', 'secondary'] }
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {};
export const SchemeBrand: Story = { args: { scheme: 'brand' } };
export const SchemeNeutral: Story = { args: { scheme: 'neutral' } };
export const SchemePositive: Story = { args: { scheme: 'positive' } };
export const SchemeDanger: Story = { args: { scheme: 'danger' } };
export const SchemeWarning: Story = { args: { scheme: 'warning' } };
export const VariantPrimary: Story = { args: { variant: 'primary' } };
export const VariantSecondary: Story = { args: { variant: 'secondary' } };

