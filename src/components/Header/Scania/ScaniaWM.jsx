import { Link } from 'react-router-dom'
import { Box, Divider, Typography } from '@material-ui/core';

import ScaniaWordmark from './scania-wordmark.svg'

export default function ScaniaWM() {

  return (
    //Display a row of; the scania wordmark logo, a divider and the RM Dashboard label,
    //horizontally and vertically centered
    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
      <Link to="/">
        <img
          src={ScaniaWordmark}
          style={{ width: 184, height: 80, marginRight: 8 }}
          alt="Scania Logo"></img>
      </Link>
      <Divider orientation="vertical" variant="middle" style={{ height: 40 }} />
      <Typography variant="h6" style={{
        margin: 0,
        color: "#747472",
        fontFamily: "Helvetica, Arial, Sans-serif",
        fontSize: "18px",
        letterSpacing: ".3px",
        textTransform: "uppercase",
        fontWeight: 300
      }}>RM DASHBOARD</Typography>
    </Box >
  );

}