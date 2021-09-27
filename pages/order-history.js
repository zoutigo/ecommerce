import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'
import axios from 'axios'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { useContext, useEffect, useReducer } from 'react'
import Layout from '../components/Layout'
import { getError } from '../utils/error'
import { Store } from '../utils/Store'
import useStyles from '../utils/styles'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }

    default:
      return state
  }
}

function OrderHistory() {
  const router = useRouter()
  const { state } = useContext(Store)
  const { userInfo } = state
  const classes = useStyles()

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  })

  useEffect(() => {
    if (!userInfo) {
      router.push('/login')
    }
    const fecthOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get(`/api/orders/history`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        })
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }
    }
    fecthOrders()
  }, [])
  return (
    <Layout title="Historique des commandes">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href={`/profile`} passHref>
                <ListItem button component="a">
                  <ListItemText primary="Profil Utilisateur" />
                </ListItem>
              </NextLink>
              <NextLink href={`/order-history`} passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Historique des commandes" />
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Historique des commandes
                </Typography>
              </ListItem>
              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>DATE</TableCell>
                          <TableCell>TOTAL</TableCell>
                          <TableCell>PAYé</TableCell>
                          <TableCell>LIVRé</TableCell>
                          <TableCell>ACTION</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>{order._id.substring(20, 24)}</TableCell>
                            <TableCell>{order.createdAt}</TableCell>
                            <TableCell>{order.totalPrice} €</TableCell>
                            <TableCell>
                              {order.isPaid
                                ? `payé le ${order.paidAt}`
                                : 'non payé'}
                            </TableCell>
                            <TableCell>
                              {order.isDelivered
                                ? `livré le ${order.deliveredAt}`
                                : 'non livré'}
                            </TableCell>
                            <TableCell>
                              <NextLink href={`/order/${order._id}`} passHref>
                                <Button variant="contained">Details</Button>
                              </NextLink>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(OrderHistory), { ssr: false })
