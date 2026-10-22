import { createTheme, alpha } from '@mui/material/styles';

/**
 * Bang mau thuong hieu "Van Dinh Paint" - tong mau chu dao den/trang, dua tren
 * thang mau "stone" (trung tinh am). Khong dung mau accent noi bat cho branding/
 * trang tri; cac mau success/error/warning chi giu lai o nhung noi can bao hieu
 * trang thai (het hang, don bi huy...), khong dung trang tri.
 */
export const palette = {
  stone: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
    950: '#0c0a09',
  },
  success: '#16a34a',
  error: '#dc2626',
  warning: '#d97706',
  info: '#2563eb',
};

declare module '@mui/material/styles' {
  interface Palette {
    stone: Palette['grey'];
  }
  interface PaletteOptions {
    stone?: PaletteOptions['grey'];
  }
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: palette.stone[900],
      light: palette.stone[700],
      dark: palette.stone[950],
      contrastText: '#fff',
    },
    secondary: {
      main: palette.stone[900],
      light: palette.stone[700],
      dark: palette.stone[950],
      contrastText: '#fff',
    },
    success: { main: palette.success },
    error: { main: palette.error },
    warning: { main: palette.warning },
    info: { main: palette.info },
    stone: palette.stone,
    background: {
      default: palette.stone[50],
      paper: '#ffffff',
    },
    text: {
      primary: palette.stone[900],
      secondary: palette.stone[500],
    },
    divider: palette.stone[200],
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: [
      '"Inter"',
      '"Be Vietnam Pro"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: { fontWeight: 900, letterSpacing: '-0.03em' },
    h2: { fontWeight: 900, letterSpacing: '-0.02em' },
    h3: { fontWeight: 800, letterSpacing: '-0.02em' },
    h4: { fontWeight: 800, letterSpacing: '-0.01em' },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { fontWeight: 700, textTransform: 'none' },
    overline: { fontWeight: 700, letterSpacing: '0.18em' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: palette.stone[50],
        },
        '::selection': {
          backgroundColor: alpha(palette.stone[900], 0.15),
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 700,
          paddingInline: 20,
          paddingBlock: 10,
        },
        containedPrimary: {
          color: '#fff',
          '&:hover': { backgroundColor: palette.stone[700] },
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': { borderWidth: 1.5 },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'medium' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#fff',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: palette.stone[900],
          fontSize: '0.72rem',
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
