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

export default function Register() {
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
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const submitHandler = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('Le mot de pass ne correspond pas')
      return
    }
    try {
      const { data } = await axios.post('/api/users/register', {
        name,
        email,
        password,
      })
      dispatch({ type: 'USER_LOGIN', payload: data })
      Cookies.set('userInfo', JSON.stringify(data))
      router.push(redirect || '/')
    } catch (err) {
      alert(err.response.data ? err.response.data.message : err.message)
    }
  }
  return (
    <Layout title="s'enregistrer">
      <form className={classes.form} onSubmit={submitHandler}>
        <Typography component="h1" variant="h1">
          enregistrer
        </Typography>
        <List>
          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              id="name"
              label="Nom"
              inputProps={{ type: 'text' }}
              onChange={(e) => setName(e.target.value)}
            />
          </ListItem>
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
              label="Mot de pass"
              inputProps={{ type: 'password' }}
              onChange={(e) => setPassword(e.target.value)}
            />
          </ListItem>
          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              id="passwordConfirm"
              label="Confirmer le mot de pass"
              inputProps={{ type: 'password' }}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              {"S'enregistrer"}
            </Button>
          </ListItem>
          <ListItem>
            Vous avez deja un compte ? &nbsp;
            <NextLink href={`/login?redirect=${redirect} || '/'`} passHref>
              <Link> Connectez vous</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  )
}
