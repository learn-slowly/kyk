'use client';

import { ThemeProvider } from 'styled-components';
import theme from './lib/theme';
import StyledComponentsRegistry from './lib/registry';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
}

export default Providers; 