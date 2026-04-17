'use client';

import * as React from 'react';
import styled from 'styled-components';
import { Button, Input, Card, Badge, Stack, Heading, Text } from '@dp/ui';
import { color, space } from '@dp/tokens';
import { ThemeContext } from './Providers';

const Page = styled.main`
  min-height: 100vh;
  padding: ${space[6]};
  background: ${color.bgPrimary};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${space[5]};
  margin-top: ${space[5]};
`;

export default function Home() {
  const { theme, setTheme } = React.useContext(ThemeContext);
  const [value, setValue] = React.useState('');

  return (
    <Page>
      <Stack direction="row" justify="space-between" align="center">
        <Heading level={1}>Design Playground</Heading>
        <Button variant="secondary" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          {theme === 'light' ? 'Dark' : 'Light'} mode
        </Button>
      </Stack>

      <Grid>
        <Card>
          <Stack gap={3}>
            <Heading level={3}>Buttons</Heading>
            <Stack direction="row" gap={2} wrap>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </Stack>
            <Stack direction="row" gap={2}>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </Stack>
          </Stack>
        </Card>

        <Card>
          <Stack gap={3}>
            <Heading level={3}>Form</Heading>
            <Input label="Email" placeholder="you@example.com" value={value} onChange={(e) => setValue(e.target.value)} />
            <Input label="Invalid" invalid defaultValue="bad input" />
            <Button fullWidth>Submit</Button>
          </Stack>
        </Card>

        <Card>
          <Stack gap={3}>
            <Heading level={3}>Badges</Heading>
            <Stack direction="row" gap={2} wrap>
              <Badge>Neutral</Badge>
              <Badge $tone="accent">Accent</Badge>
              <Badge $tone="success">Success</Badge>
              <Badge $tone="warning">Warning</Badge>
              <Badge $tone="danger">Danger</Badge>
            </Stack>
            <Text $muted $size="sm">
              Tokens flow from CSS variables.
            </Text>
          </Stack>
        </Card>
      </Grid>
    </Page>
  );
}
