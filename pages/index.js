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

export default function Home({ products }) {
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
                    <Button size="small" color="primary">
                      {' '}
                      Ajouter
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
