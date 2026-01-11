import {createTheme} from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6820dd',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ff7300',
      contrastText: '#fff',
    },
  },
  // components: {
  //   MuiCssBaseline: {
  //     styleOverrides: () => ({
  //       'html, body, #root': {
  //         height: '100%',
  //       },
  //     }),
  //   },
  // },
});

export default theme;
