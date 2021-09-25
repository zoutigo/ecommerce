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
  Button,
  Card,
  ListItem,
  List,
  CircularProgress,
} from '@material-ui/core'
import dynamic from 'next/dynamic'
import React, {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import NextLink from 'next/link'
import Image from 'next/image'
import Layout from '../../components/Layout'
import { Store } from '../../utils/Store'

import { useRouter } from 'next/router'
import useStyles from '../../utils/styles'
import CheckoutWizard from '../../components/CheckoutWizard'
import { useSnackbar } from 'notistack'
import { getError } from '../../utils/error'
import axios from 'axios'
import Cookies from 'js-cookie'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }

    default:
      return state
  }
}

function Order({ params }) {
  const router = useRouter()
  const orderId = params.id
  const { state } = useContext(Store)
  const { userInfo } = state

  const classes = useStyles()

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  })

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
    if (!order._id || (!order._id && order._id !== orderId)) {
      fecthOrder()
    }
  }, [order])

  return (
    <Layout title={`Detail de la commande ${orderId}`}>
      <CheckoutWizard activeStep={3} />
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
