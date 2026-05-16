import { createTheme } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      ...(mode === 'dark' && {
        background: {
          default: '#101828',
          paper: '#1a2231',
        },
        text: {
          primary: '#fff',
          secondary: '#b0b0b0',
        },
      }),
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
    },
  }); 