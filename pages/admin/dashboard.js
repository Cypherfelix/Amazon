import {
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  CardContent,
  CardActions,
  Typography,
} from "@material-ui/core";
// eslint-disable-next-line no-unused-vars
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
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
      return { ...state, loading: false, summary: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}
function AdminDashboard() {
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const classes = useStyles();
  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { sales: [] },
    error: "",
  });
  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
    const fetchData = async () => {
      try {
        // const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/summary`, {
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
  }, []);

  // const label = summary.salesData.map((x) => x._id);
  console.log(summary.salesData);
  return (
    <Layout title="Order History">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href={"/admin/dashboard"} passHref>
                <ListItem selected buttton component="a">
                  <ListItemText primary="Admin Dashboard"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href={"/admin/orders"} passHref>
                <ListItem buttton component="a">
                  <ListItemText primary="Orders"></ListItemText>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <Grid container spacing={5}>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h1">
                            $ {summary.ordersPrice}
                          </Typography>

                          <Typography>Sales</Typography>
                        </CardContent>

                        <CardActions>
                          <NextLink href="/admin/orders" passHref>
                            <Button size="small" color="primary">
                              View Sales
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>{" "}
                    </Grid>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h1">
                            {summary.ordersCount}
                          </Typography>

                          <Typography>Orders</Typography>
                        </CardContent>

                        <CardActions>
                          <NextLink href="/admin/orders" passHref>
                            <Button size="small" color="primary">
                              View orders
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h1">
                            {summary.productsCount}
                          </Typography>

                          <Typography>Products</Typography>
                        </CardContent>

                        <CardActions>
                          <NextLink href="/admin/products" passHref>
                            <Button size="small" color="primary">
                              View products
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h1">
                            {summary.usersCount}
                          </Typography>

                          <Typography>Users</Typography>
                        </CardContent>

                        <CardActions>
                          <NextLink href="/admin/users" passHref>
                            <Button size="small" color="primary">
                              View Users
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                  </Grid>
                )}
              </ListItem>

              <ListItem>
                <Typography component="h1" variant="h2">
                  Sales Chart
                </Typography>
              </ListItem>

              <ListItem>
                {!summary.salesData ? (
                  <CircularProgress />
                ) : (
                  <Bar
                    data={{
                      labels: summary.salesData.map((x) => x._id),
                      datasets: [
                        {
                          label: "Sales",
                          backgroundColor: "rgba(162,222,208,1)",
                          data: summary.salesData.map((x) => x.totalSales),
                        },
                      ],
                    }}
                    options={{
                      legend: { display: true, position: "right" },
                    }}
                  ></Bar>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false });
