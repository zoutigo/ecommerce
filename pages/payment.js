import {
  Button,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'

import React, { useContext, useEffect, useState } from 'react'
import CheckoutWizard from '../components/CheckoutWizard'
import Layout from '../components/Layout'
import { Store } from '../utils/Store'
import useStyles from '../utils/styles'

export default function Payment() {
  const classes = useStyles()
  const router = useRouter()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const [paymentMethod, setPaymentMethod] = useState('')
  const { state, dispatch } = useContext(Store)
  const {
    cart: { shippingAddress },
  } = state
  useEffect(() => {
    if (!shippingAddress.address) {
      router.push('/shipping')
    } else {
      setPaymentMethod(Cookies.get('paymentMethod') || '')
    }
  }, [])

  const submitHandler = (e) => {
    e.preventDefault()
    closeSnackbar()
    if (!paymentMethod) {
      enqueueSnackbar('Veillez choisir un moyen de paiement', {
        variant: 'error',
      })
    } else {
      dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod })
      Cookies.set('paymentMethod', paymentMethod)
      router.push('/placeorder')
    }
  }
  return (
    <Layout title="Moyen de paiement">
      <CheckoutWizard activeStep={2} />
      <form className={classes.form} onSubmit={submitHandler}>
        <Typography component="h1" variant="h1">
          Moyen de paiement
        </Typography>
        <List>
          <ListItem>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="Moyen de paiement"
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  label="Paypal"
                  value="Paypal"
                  control={<Radio />}
                />
                <FormControlLabel
                  label="Stripe"
                  value="Stripe"
                  control={<Radio />}
                />
                <FormControlLabel
                  label="Cash"
                  value="Cash"
                  control={<Radio />}
                />
              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem>
            <Button fullWidth type="submit" variant="contained" color="primary">
              Continuer
            </Button>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              type="button"
              variant="contained"
              onClick={() => router.push('/shipping')}
            >
              Retour
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  )
}
