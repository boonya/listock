import CssBaseline from '@mui/material/CssBaseline';
import {
  ThemeProvider as MuiThemeProvider,
  type ThemeProviderProps,
} from '@mui/material/styles';
import theme from './theme';

export default function ThemeProvider({
  children,
  ...props
}: Omit<ThemeProviderProps, 'theme'>) {
  return (
    <MuiThemeProvider theme={theme} {...props}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
