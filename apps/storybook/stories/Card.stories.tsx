import type { Meta, StoryObj } from '@storybook/react';
import { Card, Heading, Text, Stack } from '@dp/ui';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card style={{ width: 320 }}>
      <Stack gap={2}>
        <Heading level={3}>Card title</Heading>
        <Text $muted>Supporting copy inside a surface.</Text>
      </Stack>
    </Card>
  ),
};
