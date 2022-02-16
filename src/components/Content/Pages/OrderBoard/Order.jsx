import { Card, CardContent, Typography, CardActionArea } from "@material-ui/core";

/**
 * Order displayed with order data.
 * @param {*} props {id, orderState, clicked, data}
 * id - id of specific order.
 * orderState - state of the order, is one of "pending", "approved", "started".
 * clicked(orderId, orderState) - function passed from OrderBoard.
 * data - consists of id, projectname and number of engines.
 */
export default function Order({ orderDetails, id, state, clicked }) {
  const projectName = orderDetails[0];
  const numberOfEngines = orderDetails[1];
  const orderId = id;
  const orderState = state;

  return (
    <Card style={{
      marginBottom: 16,
      marginRight: 16,
      marginLeft: 16,
    }} onClick={() => clicked(orderId, orderState)}>
      <CardActionArea>
        <CardContent>
          <Typography style={{
            color: "#5e6c84",
            fontSize: "12px",
            fontWeight: 600,
            paddingBottom: 8
          }}>
            ORDER ID: {orderId}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Project Name: {projectName}
            <br />
            Engines included: {numberOfEngines}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
