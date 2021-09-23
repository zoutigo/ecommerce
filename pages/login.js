import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core'
import React from 'react'
import NextLink from 'next/link'
import Layout from '../components/Layout'
import useStyles from '../utils/styles'

export default function Login() {
  const classes = useStyles()
  return (
    <Layout title="login">
      <form className={classes.form}>
        <Typography component="h1" variant="h1">
          Login
        </Typography>
        <List>
          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              id="email"
              label="Email"
              inputProps={{ type: 'email' }}
            />
          </ListItem>
          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              id="password"
              label="Password"
              inputProps={{ type: 'password' }}
            />
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              {' '}
              Login
            </Button>
          </ListItem>
          <ListItem>
            Pas de compte ? &nbsp;
            <NextLink href="/register" passHref>
              <Link> Inscrivez vous</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  )
}
