import React from 'react'
import Head from 'next/head'
import { AppBar, Container, Toolbar, Typography } from '@material-ui/core'
import useStyles from '../utils/styles'

function Layout({ children }) {
  const classes = useStyles()
  return (
    <div>
      <Head>
        <title>E Commerce</title>
      </Head>
      <AppBar position="static">
        <Toolbar className={classes.navbar}>
          <Typography>e commerce</Typography>
        </Toolbar>
      </AppBar>
      <Container className={classes.main}>{children}</Container>
      <footer className={classes.footer}>
        <Typography>Tout droits reservés. e commerce</Typography>
      </footer>
    </div>
  )
}

export default Layout
