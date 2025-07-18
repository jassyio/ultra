import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8360c3', // A base color for primary, though the gradient will override for buttons
      // Define a custom property for the gradient background
      gradient: 'linear-gradient(135deg, #8360c3 0%, #2ebf91 100%)',
    },
    secondary: {
      main: '#2ebf91',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: 'linear-gradient(135deg, #8360c3 0%, #2ebf91 100%)',
          color: 'white', 
          transition: 'background 0.3s ease-in-out, transform 0.2s ease-in-out',
          '&:hover': {
            background: 'linear-gradient(135deg, #7253b0 0%, #25a47e 100%)',
            transform: 'scale(1.02)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
      },
    },
  },
});

export default theme; 