import { createTheme } from '@mui/material/styles';

export const getTheme = (mode = 'light') => {
  const isDark = mode === 'dark';
  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#2ebf91' : '#8360c3',
        gradient: isDark
          ? 'linear-gradient(135deg, #232526 0%, #2ebf91 60%, #8360c3 100%)'
          : 'linear-gradient(135deg, #8360c3 0%, #2ebf91 100%)',
        dark: isDark ? '#181c24' : '#7253b0',
        light: isDark ? '#2ebf91' : '#a084e8',
      },
      secondary: {
        main: isDark ? '#8360c3' : '#2ebf91',
      },
      background: {
        default: isDark ? '#181c24' : '#f0f2f5',
        paper: isDark ? '#23272f' : '#fff',
      },
      text: {
        primary: isDark ? '#f5f6fa' : '#111b21',
        secondary: isDark ? '#b2f0e6' : '#667781',
      },
      action: {
        hover: isDark ? 'rgba(46,191,145,0.08)' : 'rgba(131,96,195,0.08)',
        selected: isDark ? 'rgba(46,191,145,0.16)' : 'rgba(131,96,195,0.16)',
      },
      divider: isDark ? '#2ebf91' : '#e9edef',
      error: {
        main: '#ff5252',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          containedPrimary: {
            background: isDark
              ? 'linear-gradient(135deg, #232526 0%, #2ebf91 60%, #8360c3 100%)'
              : 'linear-gradient(135deg, #8360c3 0%, #2ebf91 100%)',
            color: 'white',
            transition: 'background 0.3s ease-in-out, transform 0.2s ease-in-out',
            '&:hover': {
              background: isDark
                ? 'linear-gradient(135deg, #1a1d20 0%, #25a47e 60%, #7253b0 100%)'
                : 'linear-gradient(135deg, #7253b0 0%, #25a47e 100%)',
              transform: 'scale(1.02)',
            },
            '&:active': {
              transform: 'scale(0.98)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: isDark
              ? 'linear-gradient(135deg, #232526 0%, #2ebf91 60%, #8360c3 100%)'
              : 'linear-gradient(135deg, #8360c3 0%, #2ebf91 100%)',
            color: 'white',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#23272f' : '#fff',
          },
        },
      },
      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            background: isDark
              ? 'linear-gradient(135deg, #232526 0%, #2ebf91 60%, #8360c3 100%)'
              : 'linear-gradient(135deg, #8360c3 0%, #2ebf91 100%)',
            color: 'white',
          },
        },
      },
      MuiSkeleton: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#23272f' : '#e0e0e0',
            color: isDark ? '#2ebf91' : '#8360c3',
          },
        },
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: 'Inter, Roboto, Arial, sans-serif',
      fontWeightBold: 700,
    },
  });
}; 