import {
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useContext, useReducer } from "react";
import Layout from "../../components/Layout";
import { getError } from "../../utils/errors";
import { Store } from "../../utils/Store";
import useStyles from "../../utils/styles";
import NextLink from "next/link";

function reducer(state, action) {
  // const { dispatch } = useContext(Store);
  // dispatch({ type: "CART_CLEAR" });
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, products: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}
function Products() {
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const classes = useStyles();
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    products: [],
    error: "",
  });
  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
    const fetchData = async () => {
      try {
        // const { data } = await axios.get(`/api/products/${productId}`);
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/products`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Layout title="Products History">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href={"/admin/dashboard"} passHref>
                <ListItem buttton component="a">
                  <ListItemText primary="Admin Dashboard"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href={"/admin/orders"} passHref>
                <ListItem buttton component="a">
                  <ListItemText primary="Orders"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href={"/admin/products"} passHref>
                <ListItem selected buttton component="a">
                  <ListItemText primary="Products"></ListItemText>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h2">
                  Products
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
                          <TableCell>NAME</TableCell>
                          <TableCell>PRICE</TableCell>
                          <TableCell>CATEGORY</TableCell>
                          <TableCell>COUNT</TableCell>
                          <TableCell>RATING</TableCell>
                          <TableCell>ACTIONS</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product._id}>
                            <TableCell>
                              {product._id.substring(20, 24)}
                            </TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>$ {product.price}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>{product.countInStock}</TableCell>
                            <TableCell>{product.rating}</TableCell>
                            <TableCell>
                              <NextLink
                                href={`/admin/product/${product._id}`}
                                passHref
                              >
                                <Button size="small" variant="contained">
                                  Edit
                                </Button>
                              </NextLink>
                              {"  "}
                              <Button size="small" variant="contained">
                                Delete
                              </Button>
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
  );
}

export default dynamic(() => Promise.resolve(Products), { ssr: false });
