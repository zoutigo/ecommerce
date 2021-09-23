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
  Select,
  MenuItem,
  Button,
  Card,
  ListItem,
  List,
} from '@material-ui/core'
import dynamic from 'next/dynamic'
import React, { useCallback, useContext } from 'react'
import NextLink from 'next/link'
import Image from 'next/image'
import Layout from '../components/Layout'
import { Store } from '../utils/Store'
import axios from 'axios'
import { useRouter } from 'next/router'

function CartScreen() {
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const { cart } = state

  const updateCartHandler = useCallback(
    async (item, quantity) => {
      const { data } = await axios.get(`/api/products/${item._id}`)
      if (data.countInStock <= quantity) {
        window.alert('Désolé , cet article est en rupture de stock')
        return
      }
      dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } })
    },
    [dispatch]
  )

  const removeItemhandler = useCallback(
    (item) => {
      dispatch({ type: 'CART_REMOVE_ITEM', payload: item })
    },
    [dispatch]
  )

  const checkoutHandler = useCallback(() => {
    router.push('/shipping')
  }, [router])
  return (
    <Layout title="Panier">
      <Typography component="h1" variant="h1">
        Panier
      </Typography>
      {cart.cartItems.length === 0 ? (
        <div>
          {' '}
          Le panier est vide.
          <NextLink href="/" passHref>
            <Link>Aller aux achats</Link>
          </NextLink>{' '}
        </div>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Nom</TableCell>
                    <TableCell align="right">Quantité</TableCell>
                    <TableCell align="right">Prix</TableCell>
                    <TableCell align="right">Action</TableCell>
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
                        <Select
                          value={item.quantity}
                          onChange={(e) =>
                            updateCartHandler(item, e.target.value)
                          }
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <MenuItem key={x + 1} value={x + 1}>
                              {x + 1}{' '}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell align="right">{item.price} € </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => removeItemhandler(item)}
                        >
                          x
                        </Button>{' '}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Typography variant="h2">
                    Sous-Total (
                    {cart.cartItems.reduce((a, c) => a + c.quantity, 0)} &nbsp;
                    articles )&nbsp;: &nbsp;
                    {cart.cartItems.reduce(
                      (a, c) => a + c.quantity * c.price,
                      0
                    )}{' '}
                    €
                  </Typography>
                </ListItem>
                <ListItem>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={checkoutHandler}
                  >
                    Valider
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false })
