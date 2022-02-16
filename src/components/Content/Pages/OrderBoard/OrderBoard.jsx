import { useState } from "react";
import { Grid, makeStyles } from "@material-ui/core";

import Orders from "./Orders";
import OrderInfo from "./OrderInfo";

const useStyles = makeStyles(() => ({
  gridItem: {
    height: "100%",
    width: "100%"
  }
}));

/**
 * Wrapper and communication interface for
 * Order, Orders and OrderInfo
 */
export default function OrderBoard() {
  const classes = useStyles();
  const [orderInfoOpen, setOrderInfoOpen] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [orderState, setOrderState] = useState(null);
  const [refreshOrdersTrigger, setRefreshOrdersTrigger] = useState(false);
  const [ordersWidth, setOrdersWidth] = useState(12);

  /**
   * Toggles refreshOrdersTrigger -> Triggers getData() in Orders. 
   * This function is passed down to OrderInfo component.
   */
  function refreshOrders() {
    setRefreshOrdersTrigger(!refreshOrdersTrigger);
  }

  /**
   * Shows OrderInfo when Order-component is clicked.
   * This function is passed to Order-components.
   * @param {*} id passed from an Order
   * @param {*} orderState "pending", "approved" or "started" passed from an Order
   */
  function orderClicked(id, orderState) {
    setOrdersWidth(9);
    setOrderInfoOpen(true);
    setOrderId(id);
    setOrderState(orderState);
  }
  /**
   * This function is passed to OrderInfo.
   */
  function closeOrderInfo() {
    setOrderInfoOpen(false);
    setOrdersWidth(12);
  }

  return (
    /**
     * Display a horizontally and vertically centered row of 1 (Orders) or 2(Orders and OrderInfo)
     * columns depending on if an order is being inspected or not.
     */
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={1}
    >
      <Grid item xs={ordersWidth} className={classes.gridItem}>
        <Orders clicked={orderClicked} refreshOrdersTrigger={refreshOrdersTrigger} />
      </Grid>

      {orderInfoOpen ? (
        <Grid item xs={3} className={classes.gridItem} style={{
          padding: 0, overflowY: "scroll",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100%", width: "100%"
        }}>
          <OrderInfo orderId={orderId} orderState={orderState}
            closeOrderInfo={closeOrderInfo} refreshOrders={refreshOrders} />
        </Grid>
      ) : null}
    </Grid>
  );
}
