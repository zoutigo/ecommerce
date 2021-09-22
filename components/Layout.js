import React from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import {
  AppBar,
  Container,
  createTheme,
  CssBaseline,
  Link,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@material-ui/core'
import useStyles from '../utils/styles'
import theme from '../utils/theme'

function Layout({ children, title, description }) {
  const classes = useStyles()
  return (
    <div>
      <Head>
        <title>{title ? `${title} - E-commerce` : 'E Commerce'}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar className={classes.navbar}>
            <NextLink href="/" passHref>
              <Link>
                <Typography className={classes.brand}>e commerce</Typography>
              </Link>
            </NextLink>
            <div className={classes.grow}></div>
            <div>
              <NextLink href="/cart" passHref>
                <Link> Cart</Link>
              </NextLink>
              <NextLink href="/login" passHref>
                <Link> Login</Link>
              </NextLink>
            </div>
          </Toolbar>
        </AppBar>
        <Container className={classes.main}>{children}</Container>
        <footer className={classes.footer}>
          <Typography>Tout droits reservés. e commerce</Typography>
        </footer>
      </ThemeProvider>
    </div>
  )
}

export default Layout
