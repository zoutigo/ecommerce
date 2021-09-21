import React from 'react'
import Head from 'next/head'
import { AppBar, Container, Toolbar, Typography } from '@material-ui/core'

function Layout({ children }) {
  return (
    <div>
      <Head>
        <title>E Commerce</title>
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Typography>e commerce</Typography>
        </Toolbar>
      </AppBar>
      <Container>{children}</Container>
      <footer>
        <Typography>Tout droits reservés. e commerce</Typography>
      </footer>
    </div>
  )
}

export default Layout
