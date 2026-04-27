import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1a73e8',
      light: '#00d4ff',
      dark: '#1557b0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ffb300',
      light: '#ffd54f',
      dark: '#e65100',
      contrastText: '#050b18',
    },
    background: {
      default: '#050b18',
      paper: '#0a1628',
    },
    text: {
      primary: '#e8f0fe',
      secondary: '#8aa3c8',
      disabled: '#4a6080',
    },
    success: { main: '#00ff88', dark: '#00c96b', contrastText: '#050b18' },
    error: { main: '#ff4444', dark: '#cc0000' },
    warning: { main: '#ffb300', dark: '#e65100' },
    info: { main: '#00d4ff', dark: '#0099cc' },
    divider: 'rgba(26, 115, 232, 0.15)',
  },
  typography: {
    fontFamily: '"Inter", "Space Grotesk", "Roboto", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { fontWeight: 400, lineHeight: 1.6 },
    body2: { fontWeight: 400, lineHeight: 1.5 },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' },
    caption: { color: '#8aa3c8' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#050b18',
          color: '#e8f0fe',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(10, 22, 40, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(26, 115, 232, 0.15)',
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            borderColor: 'rgba(26, 115, 232, 0.35)',
            boxShadow: '0 12px 40px rgba(26, 115, 232, 0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(10, 22, 40, 0.9)',
          backgroundImage: 'none',
          border: '1px solid rgba(26, 115, 232, 0.12)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 0.2s ease',
        },
        contained: {
          background: 'linear-gradient(135deg, #1a73e8 0%, #00d4ff 100%)',
          boxShadow: '0 4px 15px rgba(26, 115, 232, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1557b0 0%, #00b8d9 100%)',
            boxShadow: '0 6px 20px rgba(26, 115, 232, 0.5)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: 'rgba(26, 115, 232, 0.4)',
          color: '#00d4ff',
          '&:hover': {
            borderColor: '#1a73e8',
            background: 'rgba(26, 115, 232, 0.08)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'rgba(255, 255, 255, 0.03)',
            '& fieldset': { borderColor: 'rgba(26, 115, 232, 0.25)' },
            '&:hover fieldset': { borderColor: 'rgba(26, 115, 232, 0.5)' },
            '&.Mui-focused fieldset': { borderColor: '#1a73e8' },
          },
          '& .MuiInputLabel-root': { color: '#8aa3c8' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#00d4ff' },
          '& .MuiOutlinedInput-input': { color: '#e8f0fe' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          fontSize: '0.75rem',
        },
        outlined: {
          borderColor: 'rgba(26, 115, 232, 0.3)',
          color: '#8aa3c8',
          '&:hover': { borderColor: '#1a73e8', color: '#00d4ff' },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(5, 11, 24, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(26, 115, 232, 0.15)',
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'rgba(5, 11, 24, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(26, 115, 232, 0.15)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: '2px 8px',
          transition: 'all 0.2s ease',
          '&.Mui-selected': {
            background: 'rgba(26, 115, 232, 0.15)',
            borderLeft: '3px solid #1a73e8',
            '&:hover': { background: 'rgba(26, 115, 232, 0.2)' },
          },
          '&:hover': { background: 'rgba(26, 115, 232, 0.08)' },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'rgba(26, 115, 232, 0.12)' },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          border: '1px solid',
        },
        standardError: {
          background: 'rgba(255, 68, 68, 0.1)',
          borderColor: 'rgba(255, 68, 68, 0.3)',
          color: '#ff8888',
        },
        standardSuccess: {
          background: 'rgba(0, 255, 136, 0.08)',
          borderColor: 'rgba(0, 255, 136, 0.3)',
          color: '#00ff88',
        },
        standardInfo: {
          background: 'rgba(0, 212, 255, 0.08)',
          borderColor: 'rgba(0, 212, 255, 0.3)',
          color: '#00d4ff',
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(26, 115, 232, 0.25)',
          color: '#8aa3c8',
          '&.Mui-selected': {
            background: 'rgba(26, 115, 232, 0.2)',
            color: '#00d4ff',
            borderColor: '#1a73e8',
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            background: 'rgba(26, 115, 232, 0.08)',
            color: '#8aa3c8',
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { background: 'rgba(26, 115, 232, 0.05)' },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(26, 115, 232, 0.08)',
          color: '#e8f0fe',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: { color: '#8aa3c8' },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': { background: 'rgba(26, 115, 232, 0.1)' },
          '&.Mui-selected': { background: 'rgba(26, 115, 232, 0.15)' },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          background: 'rgba(26, 115, 232, 0.15)',
          borderRadius: 4,
        },
        bar: {
          background: 'linear-gradient(90deg, #1a73e8, #00d4ff)',
          borderRadius: 4,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#8aa3c8',
          fontWeight: 500,
          '&.Mui-selected': { color: '#00d4ff' },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          background: 'linear-gradient(90deg, #1a73e8, #00d4ff)',
          height: 2,
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1a73e8, #00d4ff)',
          boxShadow: '0 4px 20px rgba(26, 115, 232, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1557b0, #00b8d9)',
            boxShadow: '0 6px 25px rgba(26, 115, 232, 0.6)',
          },
        },
      },
    },
  },
});

export default theme;
