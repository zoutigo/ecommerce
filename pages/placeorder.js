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
} from '@material-ui/core'
import dynamic from 'next/dynamic'
import React, { useCallback, useContext, useEffect } from 'react'
import NextLink from 'next/link'
import Image from 'next/image'
import Layout from '../components/Layout'
import { Store } from '../utils/Store'

import { useRouter } from 'next/router'
import useStyles from '../utils/styles'
import CheckoutWizard from '../components/CheckoutWizard'

function PlaceOrder() {
  const router = useRouter()
  const { state } = useContext(Store)
  const { cart } = state
  const { shippingAddress, paymentMethod, cartItems } = cart
  const classes = useStyles()

  const round2 = useCallback(
    (num) => Math.round(num * 100 + Number.EPSILON) / 100, // 123.456 =123.46
    []
  )

  const itemsPrice = useCallback(
    round2(cartItems.reduce((a, c) => a + c.price * c.quantity, 0)),
    [cartItems]
  )
  const shippingPrice = useCallback(itemsPrice > 200 ? 0 : 15, [itemsPrice])

  const taxesPrice = round2(itemsPrice * 0.19)

  const totalPrice = round2(itemsPrice + shippingPrice + taxesPrice)

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment')
    }
  }, [])

  return (
    <Layout title="Panier">
      <CheckoutWizard activeStep={3} />
      <Typography component="h1" variant="h1">
        Commander
      </Typography>

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
                      {cart.cartItems.map((item) => (
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
              <ListItem>
                <Button variant="contained" color="primary" fullWidth>
                  Commander
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false })
