import { useState, useRef, useEffect } from 'react';
import { alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { makeStyles } from '@material-ui/core/styles';
import {  Box, MenuItem, MenuList, Paper, Popper, Grow, ClickAwayListener } from '@material-ui/core';
import SearchHelpers from './SearchHelpers';
import OrderInfo from '../OrderBoard/OrderInfo';

const useStyles = makeStyles((theme) => ({
  searchBar: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.35),
      '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.45),
      },
    marginLeft: 0,
    width: '100%',
    marginTop: '2.5%'
  },
  searchIconWrapper: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  styledInputBase: {
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 6),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }
}));

/**
 * Component for the search field and the search result popper.
 */
export default function Search() {
  const classes = useStyles();
  const [openSearchPopper, setOpenSearchPopper] = useState(false);
  const [orderListState, setOrderListState] = useState([]);
  const [orderId, setOrderId] = useState();
  const [orderState, setOrderState] = useState();
  const [openOrderInfo, setOpenOrderInfo] = useState(false);

  // Used for positioning the filter popper under the filter button.
  const anchorRef = useRef(null);
  const searchHelpers = new SearchHelpers(handleClick);

  /**
   * Gets the clicked order's details and display the orderInfo dialog. 
   *
   * @param {Number} id The clicked order's id.
   * @param {Number} state The clicked order's state.
   */
  function handleClick(id, state) {
    setOrderId(id);
    setOrderState(searchHelpers.getOrderState(state));
    setOpenOrderInfo(true);
  }

  /**
   * Handles the toggling of the search result popper.
   * TODO: Only open when something is written in the search field.
   */
  function handleOpenSearchPopper() {
    setOpenSearchPopper(!openSearchPopper);
  }

  /**
   * Refreshes the popper search result components.
   */
  useEffect(async () => {
    var popperResults = await searchHelpers.getPopperResultComponents();
    setOrderListState(popperResults);
  }, [orderState, openOrderInfo]);

  /**
   * Display a search field, search popper and view all search result button.
   */
  return <>
      <Box className={classes.searchBar} onClick={handleOpenSearchPopper}>
        <div className={classes.searchIconWrapper}>
          <SearchIcon />
        </div>
        <InputBase
          className={classes.styledInputBase}
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          ref={anchorRef}
        />
      </Box>
      <Popper open={openSearchPopper} anchorEl={anchorRef.current} transition style={{width:"20%"}}>
        { /* Provides the function with onEnter() and onExit() */}
        {({ TransitionProps }) => (
          <Grow  {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleOpenSearchPopper}>
                <MenuList>
                  {orderListState}
                  <MenuItem>
                    <a href="/SearchResult"><SearchIcon />View all search results</a>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      <OrderInfo orderId={orderId} orderState={orderState} orderOpenInSearchMode={openOrderInfo}
        setOpenOrderInfo={setOpenOrderInfo} closeOrderInfo={() => setOpenOrderInfo(false)}/>
  </>
}