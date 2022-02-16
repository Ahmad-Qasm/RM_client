import { useState, useEffect, useContext } from "react";
import { Grid, Link, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar } 
  from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import MuiAlert from '@mui/material/Alert';
import Cookies from 'js-cookie';

import { notifySuccess, notifyFailed } from '../../../../model/helpers/Notifiers';
import { startLoader, stopLoader } from "../../../../model/helpers/LoadingIndicator";
import { captureForm } from '../../../../model/helpers/form/CaptureForm';
import { sendGet, sendPost, sendJson } from '../../../../model/helpers/network/Network';
import InputFields from '../../../Form/InputFields';
import { UserContext } from '../../../../model/state/UserContext';
import ApprovedButtonField from './ApprovedButtonField';
import PendingButtonField from './PendingButtonField';
import OrderOverview from './OrderOverview';

/* Functions for handling different types of submits */

/**
 * Saves the changes made to an order when "save" button is pressed
 * @param {*} orderDetails
 * @param {*} fieldValues
 */
async function saveOrderChanges(orderDetails, fieldValues) {
  const completeOrderData = { ...orderDetails, ...fieldValues }; //merge missing order details: state, id
  const serializedData = JSON.stringify(completeOrderData);
  try {
    const response = await sendJson(`http://127.0.0.1:5000/order/update`, serializedData);
    if (response.status === 200)
      notifySuccess("Saved order");
    else
      notifyFailed("Failed to save order");
  } catch (error) {
    notifyFailed("Failed to save order");
  }
}

/**
 * Approves an order when "approve" button have been pressed
 * @param {*} orderId
 */
async function approveOrder(orderId) {
  try {
    const response = await sendPost(`http://127.0.0.1:5000/order/approve?orderId=${orderId}`);
    if (response.status === 200)
      notifySuccess("Approved order");
    else
      notifyFailed("Failed to approve order");
  } catch (error) {
    notifyFailed("Failed to approve order");
  }
}

/**
 * Unpproves an order when "unapprove" button have been pressed
 * @param {*} orderId
 */
async function unapproveOrder(orderId) {
  try {
    const response = await sendPost(`http://127.0.0.1:5000/order/unapprove?orderId=${orderId}`);
    if (response.status === 200)
      notifySuccess("Unapproved order");
    else
      notifyFailed("Failed to unapprove order");
  } catch (error) {
    notifyFailed("Failed to unapprove order");
  }
}

/**
 * Starts the release process and calibration sendout
 * when the "start calibration" button is pressed
 * @param {*} orderId
 */
async function startReleaseProcess(orderId) {
  try {
    const response = await sendPost(`http://127.0.0.1:5000/order/start?orderId=${orderId}`);
    if (response.status === 200)
      notifySuccess("Started release process for order");
    else
      notifyFailed("Failed to start release process");
  } catch (error) {
    notifyFailed("Failed to start release process");
  }
}

/**
 * Deletes the order and removes the reference id in the
 * user object, then updates the user object and the user cookie.
 * This happenes when the "delete" button is pressed
 * @param {*} orderId
 * @param {*} user
 * @param {*} setUser
 */
async function deleteOrder(orderId, user, setUser) {
  try {
    const response = await sendPost(`http://127.0.0.1:5000/order/delete?orderId=${orderId}`);
    if (response.status === 200) {

      // Remove the deleted order from a user's orders
      let index = user.orders.indexOf(parseInt(orderId));
      if (index > -1)
        user.orders.splice(index, 1);

      // Update the Global User and Cookie with order removed
      setUser(user);
      Cookies.set("user", user);
      notifySuccess("Deleted order");
    }
    else
      notifyFailed("Failed to delete order");
  } catch (error) {
    notifyFailed("Failed to delete order");
  }
}

/**
 * Displays order details for a single order
 *
 * @prop {int} orderId - id of selected order.
 * @prop {int} orderState - state of the selected order. ( 0 <=> pending, 1 <=> approved, 2 <=> started)
 * @prop {function} closeOrderInfo - tells parent to close this component
 * @prop {function} refreshOrders - tells parent to refetch order data
 */
export default function OrderInfo({ closeOrderInfo, orderId, orderState, refreshOrders, orderOpenInSearchMode }) {
  const [validateTrigger, setValidateTrigger] = useState({});
  const [clearTrigger, setClearTrigger] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const { user, setUser } = useContext(UserContext)
  const [storyLink, setStoryLink] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
    
  //editMode determines if we need to validate the inputfields and if they should be read only
  const [editMode, setEditMode] = useState(false);

  /**
   * Saves the project to backend if it's not already there.
   * 
   * @param {Object} projectData Name and system of the project.
   */
  async function saveCustomProject(projectData) {
    const serializedData = JSON.stringify(projectData);
    await sendJson(`http://localhost:5000/new-project`, serializedData);
  }

  /**
   * Parse the requested action from a submit and call the appropriate
   * functions
   * @param {Event} event - the event associated with the submit
   */
  async function controlAction(event) {
    event.preventDefault();
    const { requestedAction } = captureForm(event);

    startLoader();
    switch (requestedAction) {
      case "edit": {
        setEditMode(true);
        stopLoader();
        return; //return to skip refreshOrders() and closeOrderInfo();
      }
      case "cancel": {
        setEditMode(false);
        setClearTrigger(!clearTrigger);
        await getOrderData(); //load order data before changes into the fields
        stopLoader();
        return;
      }
      case "save": {
        //Triggers validation proccess in InputFields through prop: validateTrigger
        setValidateTrigger(event);
        //saveIfFormIsValid(event) gets called if all form fields have valid values
        stopLoader();
        return;
      }
      case "approve": {
        if (orderDetails.customer == "") {
          notifyFailed("Failed approving order: Customer field can not be empty", 3000);
        } else {
          await approveOrder(orderId);
          let customProjectData = {project: orderDetails.project, system: orderDetails.system};
          await saveCustomProject(customProjectData);
        }
        stopLoader();
        break;
      }
      case "unapprove": {
        await unapproveOrder(orderId);
        stopLoader();
        break;
      }
      case "start": {
        await startReleaseProcess(orderId);
        stopLoader();
        break;
      }
      case "delete": {
        await deleteOrder(orderId, user, setUser);
        stopLoader();
        break;
      }
      default:
        break;
    }
    stopLoader();

    closeOrderInfo();
    window.location.reload();
    if (orderOpenInSearchMode == undefined) {
      //Tell parent(OrderBoard) to refresh displayed orders
      refreshOrders();
    }
  }

  /**
   * Save the order field values if they are valid.
   *
   * Called from child component InputFields after an error-free validation
   * process
   * @param {Event} event - the event associated with save-submit
   */
  async function saveIfFormIsValid(event) {
    const { fieldValues } = captureForm(event);
    startLoader();
    await saveOrderChanges(orderDetails, fieldValues);
    await getOrderData();
    stopLoader();
    refreshOrders();
  }

  /**
   * @returns the appropriate buttons for the order state
   */
  function getButtons() {
    if (orderState === "pending")
      return <PendingButtonField showCancelSave={editMode} orderId={orderId} />;
    else if (orderState === "approved")
      return <ApprovedButtonField orderId={orderId} startReleaseProcess={startReleaseProcess} 
      refreshOrders={refreshOrders} orderDetails={orderDetails} setStoryLink={setStoryLink} />;
    else
      return null;
  }

  /**
   * Get order data and from the database store it in orderDetails
   */
  async function getOrderData() {
    startLoader();
    if (orderState !== undefined && orderId !== undefined) {
      try {
        const responsePromise = await sendGet(
          `http://127.0.0.1:5000/orders/${orderState}?orderId=${orderId}`);
        const orderData = await responsePromise.json();
        var project = await (
          await sendGet(`http://localhost:5000/project?name=${orderData.project}`)).json(); 
        if (project.project_responsible == null) {
          orderData.project_responsible = "";
        } else {
          orderData.project_responsible = project.project_responsible;
        }
        setOrderDetails(orderData);
      } catch (error) {
        notifyFailed("Failed to load order info");
      }
      stopLoader();
      //Show approve & edit buttons when inspecting another order
      //and after saving changes.
      setEditMode(false);
    }
  }

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (orderOpenInSearchMode !== undefined) {
      closeOrderInfo();
    } else {
      setOpen(false);
    }
  };

  //Fetch data and re-render when id changes value
  useEffect(() => {
    setOrderDetails(null); //Reset OrderOverview
    getOrderData();
  }, [orderId]);

   
  /* Saves the Jira Story link to localStorage when it changes, for it to survive the page refresh,
  and makes sure the notification for the newly created Story link is opened when the link is updated. */
  useEffect(() => {
    if (storyLink !== null && storyLink !== '') {
      localStorage.setItem('storyLink', storyLink);
    }
    var link = localStorage.getItem('storyLink');
    if (link !== null && link !== '') {
      setSnackBarOpen(true);
    }
  }, [storyLink]);
  

  /**
   * Closes the notification with the Jira Story link, and resets the link in localStorage.
   */
  function handleCloseSnackBar() {
    setSnackBarOpen(false);
    localStorage.setItem('storyLink', '');
  }

  return (
    /**
     * Display a  column of inputfields with a sticky closeButton
     * that closes this component when clicked. Also displays the order creator.
     */
    <>
      <Grid container direction="column" justifyContent="center" alignItems="center"
        spacing={1} style={{ flexWrap: "nowrap", height: "auto" }}
      >
        {orderOpenInSearchMode == undefined ? <>
        <CloseIcon onClick={() => { closeOrderInfo(); }}
          style={{
            width: "100%",
            backgroundColor: "#C8102E",
            //Using "\"-line continuation gives compiler warnings
            boxShadow: "0px 6px 6px -3px rgb(0 0 0 / 20%), 0px 10px 14px 1px rgb(0 0 0 / 14%), 0px 4px 18px 3px rgb(0 0 0 / 12%)",
            position: "sticky",
            top: 0,
          }} />

        <Grid item>
          <Link onClick={handleClickOpen}>Id: {orderId}</Link>
        </Grid>
         </> : null}
        <Dialog open={orderOpenInSearchMode !== undefined ? orderOpenInSearchMode : open} onClose={handleClose}>
          <form id="orderInfo-form" onSubmit={controlAction} style={{ height: "100%", width: "100%" }}>
            <Grid container alignItems="baseline" justifyContent="space-between">
              <DialogTitle>Order</DialogTitle>
              <h6 style={{width:"50%"}}>Order created by: {orderDetails !== null ? orderDetails.creator : ""}</h6>
            </Grid>
            <DialogContent>
              <InputFields
                callIfFormIsValid={saveIfFormIsValid}
                validateTrigger={validateTrigger}
                clearTrigger={clearTrigger}
                readOnly={!editMode}
                passedFieldValues={orderDetails}
                orderState={orderState} />
            </DialogContent>
            <DialogActions>
              {getButtons()}
            </DialogActions>
          </form>
        </Dialog>
      </Grid>
      {orderOpenInSearchMode == undefined ? <> 
	  {/* Display overview information of an order */}
      <Grid container direction="row" alignItems="flex-start" spacing={1}>
        <Grid item style={{ width: "100%", paddingLeft: 50 }} border={1}>
          {orderDetails ? <OrderOverview orderDetails={orderDetails} /> : null}
        </Grid>
      </Grid>
      </> : null}
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal :'center' }} open={snackBarOpen}>
        <MuiAlert severity="success" variant="filled" sx={{ width: '100%' }} onClose={handleCloseSnackBar}>
          Created Jira issue: 
          <Link href={localStorage.getItem('storyLink')} target="_blank" style={{color:'white'}} underline="always" 
          rel="noreferrer">
            {localStorage.getItem('storyLink')}
          </Link>
        </MuiAlert>
      </Snackbar>
    </>
  );
}