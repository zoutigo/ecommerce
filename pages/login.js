import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import NextLink from 'next/link'
import Layout from '../components/Layout'
import useStyles from '../utils/styles'
import axios from 'axios'
import { Store } from '../utils/Store'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

export default function Login() {
  const classes = useStyles()
  const router = useRouter()
  const { redirect } = router.query
  const { dispatch, state } = useContext(Store)
  const { userInfo } = state

  useEffect(() => {
    if (userInfo) {
      router.push('/')
    }
  }, [])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/users/login', { email, password })
      dispatch({ type: 'USER_LOGIN', payload: data })
      Cookies.set('userInfo', JSON.stringify(data))
      router.push(redirect || '/')
    } catch (err) {
      alert(err.response.data ? err.response.data.message : err.message)
    }
  }
  return (
    <Layout title="login">
      <form className={classes.form} onSubmit={submitHandler}>
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
              onChange={(e) => setEmail(e.target.value)}
            />
          </ListItem>
          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              id="password"
              label="Password"
              inputProps={{ type: 'password' }}
              onChange={(e) => setPassword(e.target.value)}
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
