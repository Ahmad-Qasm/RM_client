import { useContext } from "react";
import { Box } from "@material-ui/core";
import { Route } from "react-router-dom";

import LoginForm from "./Pages/LoginForm";
import OrderBoard from "./Pages/OrderBoard/OrderBoard";
import CreateOrder from "./Pages/CreateOrder/CreateOrder";
import BackOffice from "./Pages/BackOffice/BackOffice";
import PrivateRoute from "./PrivateRoute";
import SearchResult from "./Pages/SearchResult/SearchResult";
import { UserContext } from "../../model/state/UserContext";

export default function Content() {
  const { user } = useContext(UserContext)

  return (
    <Box width="100%" height="100%" style={{ overflowY: "auto" }}>
      {user ? <PrivateRoute exact path="/" component={OrderBoard} /> : <Route path="/" component={LoginForm} />}
      {/* <Route path="/login" component={LoginForm} /> */}
      {/* <PrivateRoute exact path="/" component={OrderBoard} /> */}
      <PrivateRoute path="/create-order" component={CreateOrder} />
      <PrivateRoute path="/orders" component={OrderBoard} />
      <PrivateRoute path="/BackOffice" component={BackOffice}/>
      <Route
        path="/calplan"
        component={() => {
          window.location.href = "https://ems-sw-calibration-plan:8090/login";
          return null;
        }}
      />
      <PrivateRoute path="/SearchResult" component={SearchResult}/>
    </Box>
  );
}
