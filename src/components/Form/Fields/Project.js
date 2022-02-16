import { useState, useEffect } from 'react'
import { Typography, TextField, Box, Dialog, makeStyles, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { PROJECT } from '../../../model/helpers/form/FieldConstants'
import { FieldLabels, PlaceHolders } from '../../../model/helpers/form/FieldTemplate';
import { VALID, validate } from '../../../model/helpers/form/Validator';
import { sendGet } from '../../../model/helpers/network/Network';
import { startLoader, stopLoader } from '../../../model/helpers/LoadingIndicator';
import CommonHelpers from '../../Content/Pages/BackOffice/Helpers/CommonHelpers';

const ADD_NEW = "Add new";

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
 * Project field used in the order-form
 * 
 * Uses Autocomplete from material-ui to allow for project-searching in a 
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
export default function Project({ updateField, fieldValues, validationState,
  readOnly }) {
  const classes = useStyles();
  const [projects, setProjects] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [newProject, setNewProject] = useState("");
  const [newProjectValidationState, setNewProjectValidationState] = useState(VALID);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  var projectHeaders = ['Track 8x:','Track 7x:','Track 6x:','Aftertreatment:','Others:'];

  /**
   * Add the member variable <newProject> to the dropdown list of projects and the inputfield
   * if it is valid.
   */
  function addNewProject() {
    //Validate new project
    const validationResult = validate(PROJECT, newProject);
    if (validationResult !== VALID) {
      setNewProjectValidationState(validationResult);
      return;
    }

    //Update dropdown list of projects to include the new one 
    const projectsCopy = projects.slice();
    projectsCopy.pop(); //Remove the "Add new" item
    projectsCopy.push({name: newProject}); //Add the new project to the list
    projectsCopy.push({name: ADD_NEW}); //Add the "Add new" item to the end of the list again
    setProjects(projectsCopy);

    setSelectedValue({name: newProject});
    setDialogOpen(false);

    //Reset variables
    setNewProjectValidationState(VALID);
    setNewProject("");
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
    //If the "Add new" item is picked open the new-project-dialog
    if (newSelected.name === ADD_NEW) {
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
      if (!readOnly)
      updateField({
        type: "UPDATE_FIELD", payload:
          { field: PROJECT, newValue: newValue }
      });
  }

  /**
   * Add all projects from the backend and "Add new"-item to the project list
   */
  async function getProjects() {
    const response = await sendGet(`http://localhost:5000/projects`);
    const projects = await response.json();
    var sortedProjects = await CommonHelpers.sortProjects(projects, 'createOrder');
    sortedProjects.push({name: ADD_NEW});
    setProjects(sortedProjects);
    

  }

  useEffect(() => {
    getProjects();
  }, [])

  return (
    //Display a vertically and horizontally centered column of the label and autocomplete-field for
    //the Project.
    <>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center"
        height="100%">
        <Typography>{FieldLabels[PROJECT]}</Typography>
        <Autocomplete

          /* The clear button messes with validation */
          disableClearable

          /* Selected value */
          value={selectedValue}
          onChange={changeSelected}

          /* TextField value */
          inputValue={fieldValues[PROJECT]}
          onInputChange={changeValue}

          /* Load list-options from projects  */
          options={projects}
          getOptionDisabled={option => projectHeaders.includes(option.name)}
          getOptionLabel={(option) => option.name}
          renderOption={(option) => (
              <>
                {projectHeaders.includes(option.name) ? 
                <p style={{ height:"100%", width:"100%"}}><b>{option.name}</b></p>
                : <p>{option.name}</p>}
              </>
          )}
          noOptionsText={"No matching projects"}

          /* Open popper only when not in read only mode */
          open={open}
          onOpen={() => { return readOnly ? null : setOpen(true) }}
          onClose={() => { setOpen(false) }}

          size="small"

          /* Use TextField as input-component */
          renderInput={(params) =>
            <TextField {...params}
              variant="outlined"
              placeholder={PlaceHolders[PROJECT]}
              name={PROJECT}
              //Indicate error if field value is not valid
              error={validationState[PROJECT] !== VALID}
              //Display helper text if field value is not valid
              helperText={validationState[PROJECT] !== VALID ?
                validationState[PROJECT] : null}
            />
          }

        />
      </Box>

      {/* Display a dialog containing a label, textfield and button for adding a new project */}
      <Dialog
        onClose={() => { setDialogOpen(false) }}
        open={dialogOpen} className={classes.dialog}>
        <Typography>{FieldLabels[PROJECT]}</Typography>
        <TextField
          size="small"
          inputProps={{
            readOnly: readOnly,
          }}
          variant="outlined"
          name={PROJECT}
          value={newProject}
          placeholder={PlaceHolders[PROJECT]}
          onChange={(e) => setNewProject(e.target.value)}
          //Indicate error if field value is not valid
          error={newProjectValidationState !== VALID}
          //Display helper text if field value is not valid
          helperText={newProjectValidationState !== VALID ?
            newProjectValidationState : null}
        />
        <Button style={{
          backgroundColor: "#3f51b5",
          color: "white"
        }}
          variant="contained"
          name="confirm"
          onClick={addNewProject}
        >confirm</Button>
      </Dialog>
    </>
  )
}
