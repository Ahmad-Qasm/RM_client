import { useState, useEffect, useRef } from 'react'
import { Typography, TextField, Box, Dialog, Button, makeStyles } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { BSW_VERSION, PROJECT, SYSTEM } from '../../../model/helpers/form/FieldConstants'
import { FieldLabels, PlaceHolders } from '../../../model/helpers/form/FieldTemplate';
import { EMPTY, VALID, validate } from '../../../model/helpers/form/Validator';
import { sendGet } from '../../../model/helpers/network/Network';

const ADD_NEW = "Add new";
const VIEW_ALL = "View all versions";

/* Like useEffect but does not run on first render.
   Used to prevent validation before user has submitted */
const useDidMountEffect = (func, deps) => {
  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
}

const useStyles = makeStyles((theme) => ({
  dialog: {
    "& .MuiDialog-paper": {
      //Style the Paper-component of the dialog here
      overflowY: "unset",
      width: 300,
      height: 300,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",
      alignItems: "center"
    },
    "& .MuiBox-root": {
      height: "auto !important",
      marginBottom: theme.spacing(2)
    },
    "& .MuiDialog-paperWidthSm": {
      //Remove max width and height restrictions
      maxWidth: "none",
      maxHeight: "none",
    }
  },
}));

/**
 * BSW Version field used in the order-form
 * 
 * Uses Autocomplete from material-ui to allow for bsw-version-searching in a 
 * text field with a dropdown menu showing matching alternatives
 * 
 * @prop {Function(Object)} updateField - dispatch an update field action
 * @prop {Object} validationState - key-value pair: 
 *                              (field identifier)-->(value is valid or error message)
 * @prop {Object} fieldValues - key-value pair:
 *                             (field identifier)-->(field value)
 * @prop {Boolean} readOnly - should field value be read only?
 * 
 */
export default function BSWVersion({ updateField, fieldValues, validationState,
  readOnly, updateValidationState }) {
  const classes = useStyles();
  const [bswVersions, setBSWVersions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [open, setOpen] = useState(false);
  const [newBSW, setNewBSW] = useState("");
  const [newBSWValidationState, setNewBSWValidationState] = useState(VALID);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filtered, setFiltered] = useState(true);

  /**
    * Add <newBSW> to the inputfield and the dropdown list of projects
    * if it is valid.
    */
  function addNewBSW() {
    //Validate new bsw version
    const validationResult = validate(BSW_VERSION, newBSW);
    if (validationResult !== VALID) {
      setNewBSWValidationState(validationResult);
      return;
    }

    //Update dropdown list of bsws to include the new one 
    const bswsCopy = bswVersions.slice();
    bswsCopy.pop(); //Remove the "Add new" item
    bswsCopy.push(newBSW); //Add the new bsw version to the list
    bswsCopy.push(ADD_NEW); //Add the "Add new" item to the end of the list again
    setBSWVersions(bswsCopy);

    setSelectedValue(newBSW);
    setDialogOpen(false);

    //Reset variables
    setNewBSWValidationState(VALID);
    setNewBSW("");
  }

  /**
   * Check if system is picked and set validation status appropriately
   */
  function validateSelf() {
    if (fieldValues[SYSTEM] === EMPTY) {
      updateValidationState({
        type: "SET_VALIDATION_STATUS", payload: {
          field: BSW_VERSION,
          validStatus: "System must be picked before choosing BSW version"
        }
      });
    } else {
      updateValidationState({
        type: "SET_VALIDATION_STATUS", payload: {
          field: BSW_VERSION,
          validStatus: VALID
        }
      });
    }
  }

  /**
   * Change the selected value. 
   * 
   * The selected value Is used by Autocomplete to appropriately show the
   * matching values in the dropdown box.
   * @param {Event} event - (used for pattern matching only)
   * @param {String} newSelected - the newly selected value
   */
  function changeSelected(event, newSelected) {
    if (readOnly)
      return;
    
    // If the "View all versions" item is picked, expand the bsw-list.
    if (newSelected === VIEW_ALL) {
      setFiltered(false);
      setSelectedValue(null);
      return;
    }

    //If the "Add new" item is picked open the new-project-dialog
    if (newSelected === ADD_NEW) {
      setDialogOpen(true);
      return;
    }

    setSelectedValue(newSelected);
  }

  /**
   * Change the textfield value
   * 
   * Is called when a user manually enters text in the textfield and when a value is selected
   * from the dropdown list
   * @param {Event} event - (used for pattern matching only)
   * @param {String} newValue - the value to change for the TextField
   */
  function changeValue(event, newValue) {
    if (readOnly)
      return;
    if (newValue === VIEW_ALL)
      return
    validateSelf();
    updateField({
      type: "UPDATE_FIELD", payload:
        { field: BSW_VERSION, newValue: newValue }
    });
  }

  /**
   * Get bsw-versions related to currently selected system from the backend.
   */
  async function getBSWVersions(system) {
    if (system !== "") {
      const response = await sendGet(`http://localhost:5000/bsw-versions?system=${system}`);
      const bswVersions = await response.json();
      const ascendingBswVersions = bswVersions.reverse();
      setBSWVersions(ascendingBswVersions);
    }
  }

  /**
   * Clear field when system changes value.
   */
  useDidMountEffect(() => {
    if (readOnly)
      return;

    setBSWVersions([]);
    setSelectedValue(null);
    updateField({
      type: "UPDATE_FIELD", payload:
        { field: BSW_VERSION, newValue: EMPTY }
    });
    if (fieldValues[SYSTEM] !== EMPTY)
      getBSWVersions(fieldValues[SYSTEM]);
  }, [fieldValues[SYSTEM]])

  /**
   * Activates limit of 5 shown bsw versions, and gets the new bsw versions
   * when System changes.
   */
  useEffect(() => {
    if (readOnly)
      return;
    setFiltered(true);
    setBSWVersions([]);
    if (fieldValues[SYSTEM] !== EMPTY)
      getBSWVersions(fieldValues[SYSTEM]);
  }, [fieldValues[SYSTEM]]);


  /**
   * Only shows the 5 latest bsw versions if the user has not pressed the
   * "View all versions" option. Also shows the "Add new" and the
   * "View all versions" options.
   */
  function filteredOptions() {
    var listToDisplay = bswVersions.slice();
    if (filtered) {
      listToDisplay = listToDisplay.slice(0, 5);
    }
    // If a system is picked but no bsw versions are available, show the "Add new" button.
    if (fieldValues[SYSTEM] !== EMPTY) {
      if (listToDisplay[listToDisplay.length-1] !== ADD_NEW) {
        listToDisplay.push(ADD_NEW);
      }
    }
    if (filtered && bswVersions.length > 5) {
      listToDisplay.push('View all versions');
    }
    return listToDisplay;
  };

  /**
   * Handles closing of the autocomplete window. Does not close if the user
   * presses the option "View all versions".
   */
  function handleClose(event) {
    if (event.target.textContent == VIEW_ALL)
      setOpen(true);
    else  
      setOpen(false);
  }

  return (
    <>
      {/* Display a vertically and horizontally centered column of the label and autocomplete-field for
        the BSW version. */}
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center"
        height="100%">
        <Typography>{FieldLabels[BSW_VERSION]}</Typography>
        <Autocomplete
          /* The clear button messes with validation */
          disableClearable

          /* Selected value */
          value={selectedValue}
          onChange={changeSelected}

          /* TextField value */
          inputValue={fieldValues[BSW_VERSION]}
          onInputChange={changeValue}

          /* Load list-options from projects  */
          options={bswVersions}
          noOptionsText={"No matching bsw-versions"}
          filterOptions={filteredOptions}

          /* Styles the "View all" option as a link */
          renderOption={(option) => (<> {option === VIEW_ALL ? 
            <a style={{color:'blue', textDecoration: 'underline', cursor: 'pointer'}}>{VIEW_ALL}</a>
            : <p>{option}</p>} 
          </>)}

          /* Open popper only when not in read only mode */
          open={open}
          onOpen={() => { return readOnly ? null : setOpen(true) }}
          onClose={(event) => { handleClose(event) }}

          size="small"

          /* Use TextField as input-component */
          renderInput={(params) =>
            <TextField
              {...params}
              variant="outlined"
              placeholder={PlaceHolders[BSW_VERSION]}
              name={BSW_VERSION}
              //Indicate error if field value is not valid
              error={validationState[BSW_VERSION] !== VALID}
              //Display helper text if field value is not valid
              helperText={validationState[BSW_VERSION] !== VALID ?
                validationState[BSW_VERSION] : null}
            />
          }
        />
      </Box>

      {/* Display a dialog containing a label, textfield and button for adding a new bsw-version */}
      <Dialog
        onClose={() => { setDialogOpen(false) }}
        open={dialogOpen} className={classes.dialog}>
        <Typography>{FieldLabels[BSW_VERSION]}</Typography>
        <TextField
          size="small"
          inputProps={{
            readOnly: readOnly,
          }}
          variant="outlined"
          name={BSW_VERSION}
          value={newBSW}
          placeholder={PlaceHolders[BSW_VERSION]}
          onChange={(e) => setNewBSW(e.target.value)}
          //Indicate error if field value is not valid
          error={newBSWValidationState !== VALID}
          //Display helper text if field value is not valid
          helperText={newBSWValidationState !== VALID ?
            newBSWValidationState : null}
        />
        <Button style={{
          backgroundColor: "#3f51b5",
          color: "white"
        }}
          variant="contained"
          name="confirm"
          onClick={addNewBSW}
        >confirm</Button>
      </Dialog>
    </>
  );
}