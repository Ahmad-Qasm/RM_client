import { React, useContext } from 'react';
import { NavLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Button, Grid } from '@material-ui/core';
import { UserContext } from '../../../src/model/state/UserContext';
import Search from '../Content/Pages/SearchResult/Search';

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
    color: "white",
    opacity: "0.5",
    "&:hover": {
      color: "white",
      opacity: "0.8"
    },
    "&.active": {
      opacity: "1",
    }
  },
}));

export default function NavPanel() {
  const classes = useStyles();
  const { user } = useContext(UserContext)
  
  return (
    <AppBar style={{
      backgroundColor: "#041e42",
      borderBottom: "1px solid #ebecf0",
      zIndex: 0
    }} position="static" >
      <Toolbar variant="dense">
        <Grid justify="space-between" container>
          <Grid item>
            <Button className={classes.menuButton} component={NavLink}
              to="/calplan" target="_blank">Calplan</Button>
            <Button className={classes.menuButton} component={NavLink}
              to="/orders">Orders</Button>
            <Button className={classes.menuButton} component={NavLink}
              to={'/create-order'}>Create Order</Button>
            {/*If the user is admin, the button BackOffice will be visible*/}
            { (user !== null && user.department === 'NESE') ? 
              <Button className={classes.menuButton} component={NavLink}
                to={'/BackOffice'}>Back Office</Button>
              : null 
            }
          </Grid>
          <Grid item>
            { (user !== null) ? <Search></Search> : null }
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}


