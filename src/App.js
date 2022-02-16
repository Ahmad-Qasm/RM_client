import React, { useState, useMemo } from 'react'

import { CssBaseline, createTheme, ThemeProvider, Box } from '@material-ui/core';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header/Header'
import NavPanel from './components/NavPanel/NavPanel'
import { UserContext } from './model/state/UserContext'
import Content from './components/Content/Content';
import Cookies from 'js-cookie';

/* Configure grid containers to take full width and have no margins */
//This is a fix for a known bug see: https://github.com/mui-org/material-ui/issues/7466
const theme = createTheme({
  overrides: {
    MuiGrid: {
      container: {
        width: "100% !important", 
        margin: "0 !important",
        height: "100%" //set default height to 100% because we usually want it that way
      },
    },
  }
});

export default function App() {

  const userCookieString = Cookies.get("user");

  // Set user based on cookie information, null if no user is logged in
  const [user, setUser] = useState((userCookieString ? JSON.parse(userCookieString) : null))
  const providerValue = useMemo(() => ({ user, setUser }), ([user, setUser]))

  return (
    <>
      <CssBaseline />
      <ReactNotification />
      <Router>
        {/* Make the custom theme affect every child component */}
        <ThemeProvider theme={theme}>
          <UserContext.Provider value={providerValue}>
            {/* View starts here*/}
            <Box width="100vw"
              height="100vh"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center">
              <Header />
              <NavPanel />
              <Content />
            </Box>
            {/* View ends here*/}
          </UserContext.Provider>
        </ThemeProvider>
      </Router>
    </>
  );
}
