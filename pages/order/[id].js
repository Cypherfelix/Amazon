import dynamic from "next/dynamic";
import {
  Typography,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
  List,
  ListItem,
  CircularProgress,
} from "@material-ui/core";
import React, { useContext, useEffect, useReducer } from "react";
import Layout from "../../components/Layout";
import { Store } from "../../utils/Store";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";
import useStyles from "../../utils/styles";
import CheckoutWizard from "../../components/CheckoutWizard";
import { getError } from "../../utils/errors";
import { useSnackbar } from "notistack";
import Cookies from "js-cookie";

function reducer(state, action) {
  // const { dispatch } = useContext(Store);
  // dispatch({ type: "CART_CLEAR" });
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

function Order({ params }) {
  Cookies.remove("cartItems");
  console.log("in");
  const orderId = params.id;
  const classes = useStyles();
  const router = useRouter();
  const { state } = useContext(Store);

  const { userInfo } = state;
  // const [order, setOrder] = useState({});
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });

  useEffect(() => {
    Cookies.remove("cartItems");

    if (!userInfo) {
      return router.push("/login");
    }

    const fetchOrder = async () => {
      try {
        // const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    if (!order._id || (order._id && order._id != orderId)) {
      fetchOrder();
    }
  }, []);

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isDelivered,
    isPaid,
    paidAt,
    deliveredAt,
  } = order;

  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  if (error) {
    closeSnackbar();
    enqueueSnackbar(error, { variant: "error" });
  }

  return (
    <Layout title="Order Details">
      <CheckoutWizard activeStep={3}></CheckoutWizard>
      <Typography component="h1" variant="h1">
        Order :- {orderId}
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
                  <Typography variant="h2" component="h2">
                    Shipping Address
                  </Typography>
                </ListItem>

                <ListItem>
                  {shippingAddress.fullName}, {shippingAddress.address},{" "}
                  {shippingAddress.city},{shippingAddress.postalCode},{" "}
                  {shippingAddress.country}
                </ListItem>
                <ListItem>
                  Status:{" "}
                  {isDelivered
                    ? `delivered at ${deliveredAt}`
                    : "not delivered"}
                </ListItem>
              </List>
            </Card>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography variant="h2" component="h2">
                    Payment Method
                  </Typography>
                </ListItem>
                <ListItem>{paymentMethod}</ListItem>
                <ListItem>
                  Status: {isPaid ? `paid at ${paidAt}` : "not paid"}
                </ListItem>
              </List>
            </Card>

            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography variant="h2" component="h2">
                    Order Items
                  </Typography>
                </ListItem>

                <ListItem>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Image</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderItems.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell>
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={50}
                                height={50}
                              ></Image>
                            </TableCell>
                            <TableCell>
                              <Typography>{item.name}</Typography>
                            </TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">
                              <Typography>$ {item.price}</Typography>
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
                  <Typography variant="h2">Order Summary</Typography>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Items: </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">$ {itemsPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Tax: </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right"> {taxPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Shipping: </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">{shippingPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>
                        <strong>Total:</strong>{" "}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">
                        <strong>$ {totalPrice}</strong>
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
  );
}

export async function getServerSideProps({ params }) {
  return { props: { params } };
}

export default dynamic(() => Promise.resolve(Order), { ssr: false });
