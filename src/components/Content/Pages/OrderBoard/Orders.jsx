import { useState, useEffect } from "react";
import { Grid, Paper, makeStyles, Typography } from "@material-ui/core";

import Order from "./Order";
import { startLoader, stopLoader } from "../../../../model/helpers/LoadingIndicator";
import { notifyFailed } from "../../../../model/helpers/Notifiers";
import { sendGet } from "../../../../model/helpers/network/Network";

const useStyles = makeStyles((theme) => ({
  paperHeader: {
    color: "#5e6c84",
    fontWeight: 600,
    textAlign: "center",
    marginBottom: theme.spacing(1)
  },
  gridItem: {
    height: "100%",
  },
  paper: {
    height: "100%",
    paddingTop: theme.spacing(2),
    backgroundColor: "#F4F5F7",
    overflowY: "auto",
  },
}));

/**
 * Fetches data from database and displays them as cards in 
 * three columns of Paper-components.
 * @param {*} props clicked(orderId, orderState) passed on to Order-components
 */
export default function Orders({ refreshOrdersTrigger, clicked }) {
  const classes = useStyles();
  const [pendingOrderListState, setPendingOrdersListState] = useState([]);
  const [approvedOrderListState, setApprovedOrdersListState] = useState([]);
  const [startedOrderListState, setStartedOrdersListState] = useState([]);

  //TODO: See if algorithm for storing orders into the appropriate lists (pending, approved, started)
  //can be can be simplified

  /**
   * Generate and load Order-components into their appropriate list from an object containing 
   * orders-data
   * @param {Object} ordersData 
   * @param {Objcet} state - Order state: "pending", "approved", "started"
   */
  function createOrderComponents(ordersData, state) {
    let orderList = [];
    for (var id in ordersData) {
      // Check if the property/key is defined in the object itself, not in parent
      if (ordersData.hasOwnProperty(id)) {
        orderList.push(
          <Order
            id={id}
            orderDetails={ordersData[id]}
            state={state}
            clicked={clicked}
          />
        );
      }
    }

    if (state === "pending")
      setPendingOrdersListState(orderList);
    else if (state === "approved")
      setApprovedOrdersListState(orderList);
    else if (state === "started")
      setStartedOrdersListState(orderList);

  }

  /**
   * Fetches order data from server for different states
   * and saves it to corresponding list object.
   * 
   * Notifies user in case of error.
   */
  async function getOrders() {
    let pendingOrders;
    let approvedOrders;
    let startedOrders;

    try {
      startLoader();
      pendingOrders = await (
        await sendGet("http://127.0.0.1:5000/orders/pending")
      ).json(); // TODO FIXME: Store server name in global constant

      approvedOrders = await (
        await sendGet("http://127.0.0.1:5000/orders/approved")
      ).json(); // TODO FIXME: Store server name in global constant

      startedOrders = await (
        await sendGet("http://127.0.0.1:5000/orders/started")
      ).json(); // TODO FIXME: Store server name in global constan

      createOrderComponents(pendingOrders, "pending");
      createOrderComponents(approvedOrders, "approved");
      createOrderComponents(startedOrders, "started");
    } catch (error) {
      notifyFailed("Failed to retrieve orders")
    }
    stopLoader();
  }

  useEffect(() => {
    getOrders();
  }, [refreshOrdersTrigger]);

  return (
    /**
     * Display a centered row of three equally sized Paper-components taking full height.
     * The first Paper-component holds the pending-orders
     * The second Paper-component holds the approved-orders
     * The third Paper-component holds the started-orders
     */
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={2}
      className={classes.gridContainer}
    >
      {/* Pending Orders */}
      <Grid item xs={4} className={classes.gridItem}>
        <Paper elevation={10} className={classes.paper}>
          <Typography className={classes.paperHeader}>PENDING</Typography>
          {pendingOrderListState}
        </Paper>
      </Grid>

      {/* Approved Orders */}
      <Grid item xs={4} className={classes.gridItem}>
        <Paper elevation={10} className={classes.paper}>
          <Typography className={classes.paperHeader}>APPROVED</Typography>
          {approvedOrderListState}
        </Paper>
      </Grid>

      {/* Started Release */}
      <Grid item xs={4} className={classes.gridItem}>
        <Paper elevation={10} className={classes.paper}>
          <Typography className={classes.paperHeader}>STARTED</Typography>
          {startedOrderListState}
        </Paper>
      </Grid>
    </Grid>
  );
}
