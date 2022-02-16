import { React, useContext } from 'react'
import { Box } from '@material-ui/core';

import ScaniaLogo from './Scania/ScaniaLogo'
import ScaniaWM from './Scania/ScaniaWM'
import { UserContext } from '../../model/state/UserContext'
import UserDropDown from './UserDropDown'

export default function Header() {
  const { user } = useContext(UserContext)

  return (
    //Display a row containing: the scania wordmark to the left, (if loading) loader in the center,
    //the UserDropdown popper and scania logo to the right 
    <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center"
         width="100%" paddingLeft={3} paddingRight={3}>
      <ScaniaWM />
      <div id="loader" style={{ left: "50%", position: "absolute" }}></div>
      {/* Group the userdropdown with the scania logo in a row vertically and horizontally
          centered row */}
      <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center">
        {user ? <UserDropDown /> : null}
        <ScaniaLogo />
      </Box>
    </Box>
  );
};