import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@material-ui/core'
import NextLink from 'next/link'
import Layout from '../components/Layout'
import db from '../utils/db'
import Product from '../models/Product'
import { useCallback, useContext } from 'react'
import axios from 'axios'
import { Store } from '../utils/Store'
import { useRouter } from 'next/router'

export default function Home({ products }) {
  const router = useRouter()
  const { dispatch, state } = useContext(Store)
  const addToCartHandler = useCallback(
    async (product) => {
      const existItem = state.cart.cartItems.find((x) => x._id === product._id)
      const quantity = existItem ? existItem.quantity + 1 : 1

      const { data } = await axios.get(`/api/products/${product._id}`)
      if (data.countInStock < quantity) {
        window.alert('Désolé , cet article est en rupture de stock')
        return
      }

      dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } })
      router.push('/cart')
    },
    [dispatch, router]
  )
  return (
    <Layout>
      <div>
        <h1>Products</h1>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item md={4} key={product.name}>
              <NextLink href={`/product/${product.slug}`} passHref>
                <Card>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={product.image}
                      title={product.name}
                    />
                    <CardContent>
                      <Typography>{product.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Typography>€ {product.price}</Typography>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => addToCartHandler(product)}
                    >
                      {' '}
                      Ajouter au panier
                    </Button>
                  </CardActions>
                </Card>
              </NextLink>
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  await db.connect()
  const products = await Product.find({}).lean()
  await db.disconnect()

  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  }
}
