import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
  navbar: {
    background: '#203040',
    '& a': {
      color: '#ffffff',
      marginLeft: 10,
    },
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  grow: {
    flexGrow: 1,
  },
  main: {
    minHeight: '80vh',
  },
  footer: {
    textAlign: 'center',
    marginTop: '10px',
  },
  section: {
    marginTop: '10px',
    marginBottom: '10px',
  },
  form: {
    maxWidth: 800,
    margin: '0 auto',
  },
  navbarButton: {
    color: '#ffffff',
    textTransform: 'initial',
  },
  transparentBackground: {
    background: 'transparent',
  },
  error: {
    color: '#f04040',
  },
})

export default useStyles
