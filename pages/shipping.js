import {
  Button,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core'
import React, { useContext, useEffect } from 'react'

import Layout from '../components/Layout'
import useStyles from '../utils/styles'

import { Store } from '../utils/Store'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

import { Controller, useForm } from 'react-hook-form'
import CheckoutWizard from '../components/CheckoutWizard'

export default function Shipping() {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm()

  const classes = useStyles()
  const router = useRouter()
  const { dispatch, state } = useContext(Store)
  const { userInfo, cart } = state
  const { shippingAddress } = cart

  useEffect(() => {
    if (!userInfo) {
      router.push('/login?redirect=/shipping')
    }

    setValue('fullName', shippingAddress.fullName)
    setValue('address', shippingAddress.address)
    setValue('city', shippingAddress.city)
    setValue('postalCode', shippingAddress.postalCode)
    setValue('country', shippingAddress.country)
  }, [])

  const submitHandler = ({ fullName, address, city, postalCode, country }) => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, address, city, postalCode, country },
    })
    Cookies.set(
      'shippingAddress',
      JSON.stringify({ fullName, address, city, postalCode, country })
    )
    router.push('/payment')
  }
  return (
    <Layout title="Adresse d'expédition">
      <CheckoutWizard activeStep={1} />
      <form className={classes.form} onSubmit={handleSubmit(submitHandler)}>
        <Typography component="h1" variant="h1">
          {"Adresse d'expédition"}
        </Typography>
        <List>
          <ListItem>
            <Controller
              name="fullName"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="fullName"
                  label="Nom complet"
                  error={Boolean(errors.fullName)}
                  helperText={
                    errors.fullName
                      ? errors.fullName.type === 'minLength'
                        ? 'Le nom complet doit avoir au moins 2 caractères'
                        : 'Le nom complet est obligatoire'
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name="address"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="address"
                  label="Adresse"
                  error={Boolean(errors.addres)}
                  helperText={
                    errors.addres
                      ? errors.addres.type === 'minLength'
                        ? "L'adresse doit avoir au moins 2 caractères"
                        : "L'adresse complet est obligatoire"
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name="city"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="city"
                  label="Ville"
                  error={Boolean(errors.city)}
                  helperText={
                    errors.city
                      ? errors.city.type === 'minLength'
                        ? 'La ville doit avoir au moins 2 caractères'
                        : 'La ville  est obligatoire'
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name="postalCode"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="postalCode"
                  label="Code postal"
                  error={Boolean(errors.postalCode)}
                  helperText={
                    errors.postalCode
                      ? errors.postalCode.type === 'minLength'
                        ? 'Le code postal doit avoir au moins 2 caractères'
                        : 'Le code postal est obligatoire'
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name="country"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="country"
                  label="Pays"
                  error={Boolean(errors.country)}
                  helperText={
                    errors.country
                      ? errors.country.type === 'minLength'
                        ? 'Le pays doit avoir au moins 2 caractères'
                        : 'Le pays est obligatoire'
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>

          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Continuer
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  )
}
