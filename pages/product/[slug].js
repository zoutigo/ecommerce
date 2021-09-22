import React, { useCallback, useContext } from 'react'
import Image from 'next/image'
import Layout from '../../components/Layout'
import {
  Button,
  Card,
  Grid,
  Link,
  List,
  ListItem,
  Typography,
} from '@material-ui/core'
import NextLink from 'next/link'
import useStyles from '../../utils/styles'
import Product from '../../models/Product'
import db from '../../utils/db'
import axios from 'axios'
import { Store } from '../../utils/Store'

function ProductScreen({ product }) {
  const classes = useStyles()
  const { dispatch } = useContext(Store)

  const addToCartHandler = useCallback(async () => {
    const { data } = await axios.get(`/api/products/${product._id}`)
    if (data.countInStock <= 0) {
      window.alert('Désolé , cet article est en rupture de stock')
      return
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity: 1 } })
  }, [product, dispatch])

  if (!product) return <div>Product Not Found</div>
  return (
    <Layout title={product.name} description={product.description}>
      <div className={classes.section}>
        <NextLink href="/" passHref>
          <Link>
            <Typography>Retour aux articles</Typography>
          </Link>
        </NextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography component="h1" variant="h1">
                {product.name}
              </Typography>{' '}
            </ListItem>
            <ListItem>
              <Typography>Categorie: {product.category}</Typography>{' '}
            </ListItem>
            <ListItem>
              <Typography>Marque: {product.brand} </Typography>
            </ListItem>
            <ListItem>
              <Typography>
                Note: {product.rating} étoiles ({product.numReviews} avis){' '}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography> Description: {product.description} </Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Prix</Typography>{' '}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>€ {product.price}</Typography>{' '}
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Disponibilité</Typography>{' '}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      {product.countInStock > 0 ? 'En stock' : 'Indisponible'}
                    </Typography>{' '}
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={addToCartHandler}
                >
                  Ajouter au panier
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const {
    params: { slug },
  } = context

  await db.connect()
  const product = await Product.findOne({ slug }).lean()
  await db.disconnect()

  return {
    props: {
      product: db.convertDocToObj(product),
    },
  }
}

export default ProductScreen
