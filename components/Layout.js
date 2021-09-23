import React, { useCallback, useContext, useState } from 'react'
import { Button, createTheme, Menu, MenuItem, Switch } from '@material-ui/core'
import Head from 'next/head'
import NextLink from 'next/link'
import {
  AppBar,
  Container,
  CssBaseline,
  Link,
  ThemeProvider,
  Toolbar,
  Typography,
  Badge,
} from '@material-ui/core'
import useStyles from '../utils/styles'
import { Store } from '../utils/Store'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

function Layout({ children, title, description }) {
  const { state, dispatch } = useContext(Store)
  const { darkMode, cart, userInfo } = state
  const classes = useStyles()
  const router = useRouter()

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
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208080',
      },
    },
  })

  const darkModeHandler = useCallback(() => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' })
    const newDarkMode = !darkMode
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF')
  }, [darkMode, dispatch])

  const [anchorEl, setAnchorEl] = useState(null)
  const loginClickHandler = useCallback(
    (e) => {
      setAnchorEl(e.currentTarget)
    },
    [setAnchorEl]
  )

  const loginMenuCloseHandler = useCallback(() => {
    setAnchorEl(null)
  }, [setAnchorEl])

  const loggoutClickHandler = useCallback(() => {
    setAnchorEl(null)
    dispatch({ type: 'USER_LOGOUT' })
    Cookies.remove('userInfo')
    Cookies.remove('cartItems')
    router.push('/')
  }, [setAnchorEl, dispatch])

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
            <Switch checked={darkMode} onChange={darkModeHandler}></Switch>
            <div>
              <NextLink href="/cart" passHref>
                <Link>
                  {cart.cartItems.length > 0 ? (
                    <Badge
                      color="secondary"
                      badgeContent={cart.cartItems.length}
                    >
                      Panier
                    </Badge>
                  ) : (
                    'Panier'
                  )}
                </Link>
              </NextLink>
              {userInfo ? (
                <>
                  <Button
                    id="basic-button"
                    aria-controls="basic-menu"
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={loginClickHandler}
                    className={classes.navbarButton}
                  >
                    {userInfo.name}
                  </Button>
                  <Menu
                    id="basic-menu"
                    keepMounted
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={loginMenuCloseHandler}
                  >
                    <MenuItem onClick={loginMenuCloseHandler}>Profile</MenuItem>
                    <MenuItem onClick={loginMenuCloseHandler}>
                      My account
                    </MenuItem>
                    <MenuItem onClick={loggoutClickHandler}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <NextLink href="/login" passHref>
                  <Link> Login</Link>
                </NextLink>
              )}
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
