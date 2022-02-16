import { makeStyles } from '@material-ui/core';

/**
 * Styles for input fields.
 */
export const inputFieldStyles = makeStyles((theme) => ({
  paperHeader: {color: "#5e6c84", fontWeight: 600, textAlign: "center"},
  paper: {width: "100%", paddingBottom: theme.spacing(1), overflowY: "auto"},
}));

/**
 * Styles for listAndDetail views.
 */
export const listAndDetailStyles = makeStyles(() => ({
  paperHeader: { color: "#5e6c84", fontWeight: 600, textAlign: "center"},
  paper: {width: "100%", height: "100%", marginLeft:"20", overflowY: "auto"},
  dialog: {"& .MuiDialog-paper": {width: 300}}
}));

/**
 * Styles for the BackOffice components.
 */
export const BackOfficeStyles = makeStyles((theme) => ({
  paperHeader: {color: "#5e6c84", fontWeight: 600, textAlign: "center", marginBottom: theme.spacing(1),
    marginLeft: "0.5em",marginTop: "2%"},
  paper: { height: "100%", paddingTop: theme.spacing(2), backgroundColor: "#F4F5F7", overflowY: "auto"},
  categoryListCard: {marginBottom: 16},
  categoryListText: {color: "#5e6c84", fontSize: "18px", fontWeight: 600, paddingBottom: 8, marginTop: 20,
    marginBottom: 20 }
}));