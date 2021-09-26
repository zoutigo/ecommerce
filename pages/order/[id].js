import {
  Grid,
  TableContainer,
  Table,
  Typography,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link,
  Card,
  ListItem,
  List,
  CircularProgress,
} from '@material-ui/core'
import dynamic from 'next/dynamic'
import React, { useContext, useEffect, useReducer } from 'react'
import NextLink from 'next/link'
import Image from 'next/image'
import Layout from '../../components/Layout'
import { Store } from '../../utils/Store'

import { useRouter } from 'next/router'
import useStyles from '../../utils/styles'

import { getError } from '../../utils/error'
import axios from 'axios'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { useSnackbar } from 'notistack'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true }
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true }
    case 'PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload }
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false, errorPay: '' }

    default:
      return state
  }
}

function Order({ params }) {
  const router = useRouter()
  const orderId = params.id
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()
  const { state } = useContext(Store)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const { userInfo } = state

  const classes = useStyles()

  const [{ loading, error, order, successPay }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      order: {},
      error: '',
    }
  )

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxesPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    isDelivered,
    paidAt,
    deliverdAt,
  } = order

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login')
    }

    const fecthOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        })
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }
    }
    if (!order._id || successPay || (!order._id && order._id !== orderId)) {
      fecthOrder()
      if (successPay) {
        dispatch({ type: 'PAY_RESET' })
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        })
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'EUR',
          },
        })
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' })
      }
      loadPaypalScript()
    }
  }, [order, successPay])

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderId) => orderId)
  }

  const onApprove = (data, actions) =>
    actions.order.capture().then(async (details) => {
      try {
        dispatch({ type: 'PAY_REQUEST' })
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        )
        dispatch({ type: 'PAY_SUCCESS', payload: data })
        enqueueSnackbar('La commande est payée', { variant: 'success' })
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) })
        enqueueSnackbar(getError(err), { variant: 'error' })
      }
    })

  const onError = (err) => {
    enqueueSnackbar(getError(err), { variant: 'error' })
  }

  return (
    <Layout title={`Detail de la commande ${orderId}`}>
      <Typography component="h1" variant="h1">
        Numero de commande &nbsp; {orderId}
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography className={classes.error}>{error}</Typography>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Adresse de livraison
                  </Typography>
                </ListItem>
                <ListItem>
                  {shippingAddress.fullName},{shippingAddress.address},
                  {shippingAddress.city},{shippingAddress.postalCode},
                  {shippingAddress.country},
                </ListItem>
                <ListItem>
                  Statut: {isDelivered ? `Livré le ${deliverdAt}` : 'non livré'}
                </ListItem>
              </List>
            </Card>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Moyen de paiement
                  </Typography>
                </ListItem>
                <ListItem>{paymentMethod}</ListItem>
                <ListItem>
                  Statut: {isPaid ? `payé le ${paidAt}` : 'impayé'}
                </ListItem>
              </List>
            </Card>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Articles sélectionnés :
                  </Typography>
                </ListItem>
                <ListItem>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Image</TableCell>
                          <TableCell>Nom</TableCell>
                          <TableCell align="right">Quantité</TableCell>
                          <TableCell align="right">Prix</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderItems.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell>
                              <NextLink href={`/product/${item.slug}`} passHref>
                                <Link>
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={50}
                                    height={50}
                                  />
                                </Link>
                              </NextLink>
                            </TableCell>
                            <TableCell>
                              <NextLink href={`/product/${item.slug}`} passHref>
                                <Link>
                                  <Typography>{item.name} </Typography>
                                </Link>
                              </NextLink>
                            </TableCell>

                            <TableCell align="right">
                              <Typography>{item.quantity} </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography>{item.price} € </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </ListItem>
              </List>
            </Card>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography variant="h2">Resumé de la commande</Typography>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography> Articles: </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right"> {itemsPrice}€ </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography> TVA: </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right"> {taxesPrice}€ </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography> Livraison: </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right"> {shippingPrice}€ </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>
                        <strong> Total:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">
                        <strong>{totalPrice}€</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                {!isPaid && (
                  <ListItem>
                    {isPending ? (
                      <CircularProgress />
                    ) : (
                      <div className={classes.fullWidth}>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        />
                      </div>
                    )}
                  </ListItem>
                )}
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  return { props: { params } }
}

export default dynamic(() => Promise.resolve(Order), { ssr: false })
