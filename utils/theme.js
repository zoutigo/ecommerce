import { createTheme } from '@material-ui/core'

const theme = createTheme({
  typography: {
    h1: {
      fontSize: '1.6rem',
      fontWeight: 400,
      margin: '1rem 0',
    },
    h2: {
      fontSize: '1.4rem',
      fontWeight: 400,
      margin: '1rem 0',
    },
  },
  palette: {
    type: 'light',
    primary: {
      main: '#f0c000',
    },
    secondary: {
      main: '#208080',
    },
  },
})

export default theme
