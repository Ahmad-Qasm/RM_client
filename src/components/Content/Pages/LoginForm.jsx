import { useState, useContext } from 'react'
import { Grid, Paper, TextField, Typography } from '@material-ui/core'
import Cookies from 'js-cookie'

import { notifySuccess, notifyFailed } from '../../../model/helpers/Notifiers';
import { sendGetLogin } from '../../../model/helpers/network/Network';
import { UserContext } from '../../../model/state/UserContext'
import { startLoader, stopLoader } from '../../../model/helpers/LoadingIndicator';
import { BlueSubmitButton } from '../../../model/helpers/button/FormButton';

export default function LoginForm() {
  const { setUser } = useContext(UserContext)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const credentials = { username: username, password: password };
    const serializedData = JSON.stringify(credentials);

    startLoader();
    try {
      const response = await sendGetLogin(`http://127.0.0.1:5000/login`, serializedData);
      if (response.status === 200) {
        const userInfo = await response.json();
        let json_orders = JSON.parse(userInfo.orders);

        // TODO: flytta till lämpligare komponent
        var ids = [];
        // Loop over the orders and if the id is defined add it
        for (var i = 0; i < json_orders.length; i++) {
          if (typeof json_orders[i].id !== "undefined") {
            ids.push(json_orders[i].id);
          }
        }

        // Replace the array of orders to only contain respective ids to get rid 
        // of arrays in array structure. Is done for easier access to the ids.
        userInfo.orders = ids;

        localStorage.setItem('user_info', userInfo.access_token);
        setUser(userInfo);
        Cookies.set("user", userInfo);
        localStorage.setItem('jira_session', JSON.stringify(userInfo.jira_session));

        notifySuccess("Logged in")
      }
      else
        notifyFailed("Failed to login")
    } catch (error) {
      notifyFailed("Failed to login")
    }
    stopLoader();
  }

  return (
    /**
     * Display a horizontally centered login-form, 100px from the NavPanel.
     */
    <Grid container alignItems="flex-start" justifyContent="center" >
      <form onSubmit={handleSubmit}>
        <Paper style={{ padding: "10px", marginTop: "100px" }}>
          <Grid container style={{ padding: "50px" }} spacing={1}>
            <Grid item xs={6}>
              <Typography variant="h5">Username</Typography>
              <TextField placeholder="Username" value={username}
                onChange={(e) => { setUsername(e.target.value) }}></TextField>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5">Password </Typography>
              <TextField type="password" placeholder="Password" value={password}
                onChange={(e) => { setPassword(e.target.value) }}></TextField>
            </Grid>
          </Grid>
          <Grid container alignItems="center" justifyContent="center">
            <BlueSubmitButton buttonName="login" buttonText="Login" />
          </Grid>
        </Paper>
      </form>
    </Grid>
  );
}
