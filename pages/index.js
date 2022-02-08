import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@material-ui/core";
import Layout from "../Components/Layout";
// import data from "../utils/data";
import NextLink from "next/link";
import db from "../utils/db";
import Product from "../models/Product";
import axios from "axios";
import { useContext } from "react";
import { Store } from "../utils/Store";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { getError } from "../utils/errors";

export default function Home(props) {
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { products, error } = props;
  const { state, dispatch } = useContext(Store);
  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      closeSnackbar();
      enqueueSnackbar("Sorry Product is Out of Stock");
      return;
    }
    closeSnackbar();
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    enqueueSnackbar(product.name + " added to cart ", {
      variant: "success",
      autoHideDuration: 3000,
    });

    //router.push("/cart");
  };

  if (error != null) {
    closeSnackbar();
    enqueueSnackbar(getError(error), { variant: "error" });
    return (
      <Layout>
        <Button
          size="large"
          color="primary"
          onClick={() => {
            router.push("/");
          }}
        >
          Refresh
        </Button>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <h1>Products</h1>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item md={4} key={product.name}>
              <Card>
                <NextLink href={`/product/${product.slug}`} passHref>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={product.image}
                      title={product.name}
                    ></CardMedia>
                    <CardContent>
                      <Typography>{product.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                </NextLink>

                <CardActions>
                  <Typography>$ {product.price}</Typography>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => addToCartHandler(product)}
                  >
                    Add to cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
}
export async function getServerSideProps() {
  try {
    await db.connect();
  } catch (err) {
    return {
      props: {
        products: null,
        error: err,
      },
    };
  }

  const products = await Product.find({}).lean();
  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertDocToObj),
      error: null,
    },
  };
}
