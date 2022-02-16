import { useState, useEffect, useReducer } from "react";
import { Box,Grid, Paper, Typography, DialogContent, DialogActions, 
  Dialog, MenuItem, Select } from "@material-ui/core";

import { PROJECT, SYSTEM, PROJECT_RESPONSIBLE  } from "../../../../../model/helpers/form/FieldConstants";
import { FieldLabels, FieldTemplate } from '../../../../../model/helpers/form/FieldTemplate';
import * as Consts from "../../../../../model/helpers/form/FieldConstants";
import StyledCloseIcon from "../../../../../model/helpers/button/StyledCloseIcon";
import { validate, VALID } from "../../../../../model/helpers/form/Validator";
import DetailListItem from "../DetailListItem";
import ProjectRequestHelpers from "../Helpers/ProjectRequestHelpers";
import { listAndDetailStyles } from "../Helpers/StyleHelpers";
import ConfirmationDialog from "../ConfirmationDialog";
import CommonHelpers from "../Helpers/CommonHelpers";
import NewButton from "../Buttons/NewButton";
import InputTextField from "../InputTextField";
import EditInputFields from "../EditInputFields";
import SaveButton from "../Buttons/SaveButton";
import { startLoader, stopLoader } from "../../../../../model/helpers/LoadingIndicator";

/**
 * The list of projects, the detail view of an individual project, and the dialog for 
 * creating a new project.
 * 
 * @param {*} props { projectInfoOpen, closeProjectList, openAndSetClickedListItem, 
 * closeProjectDetailInfo, activeItemName, centerWidth, rightWidth, setHasBeenSaved, 
 * editProjectMode, setEditProjectMode, activeItemId, projectHasBeenSaved, 
 * componentDetails, projectListOpen }
 * projectInfoOpen - Boolean value telling whether or not to display the project's detail info.
 * closeProjectList - Function passed from BackOffice.
 * openAndSetClickedListItem - Function passed from BackOffice.
 * closeProjectDetailInfo - Function passed from BackOffice.
 * activeItemName - Name of the currently chosen list item.
 * centerWidth - Size of the center box.
 * rightWidth - Size of the right box.
 * setHasBeenSaved - Function passed from BackOffice.
 * editProjectMode - Boolean value telling whether the user is in edit project mode.
 * setEditProjectMode - Function passed from BackOffice.
 * projectHasBeenSaved - Boolean value telling whether a project has just been saved.
 * activeItemId - ID of the currently chosen list item.
 * componentDetails - Details of the currently chosen list item.
 * projectListOpen - Boolean value telling whether the project list should be opened or not.
 */
export default function ProjectListAndDetail({ projectInfoOpen, closeProjectList, 
  openAndSetClickedListItem, closeProjectDetailInfo, activeItemName, centerWidth, rightWidth, 
  setHasBeenSaved, editProjectMode, setEditProjectMode, activeItemId, projectHasBeenSaved, 
  componentDetails, projectListOpen }) {
  const classes = listAndDetailStyles();
  const [systems, setSystems] = useState("");
  const [projectListState, setProjectListState] = useState([]);
  const [open, setOpen] = useState(false);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [fieldValues, updateField] = useReducer(CommonHelpers.valueReducer, 
    FieldTemplate[Consts.PROJECT, Consts.SYSTEM]);
  const [projectValidationState, setProjectValidationState] = useState(VALID);
  const [projectResponsibleValidationState, setProjectResponsibleValidationState] = useState(true);
  var projectHeaders = ['Track 8x:','Track 7x:','Track 6x:','Aftertreatment:','Others:'];

  // Fetches projects from backend when a project has been saved.
  useEffect(async () => {
    startLoader()
    var projects = await ProjectRequestHelpers.getProjects();
    var sortedProjects = await CommonHelpers.sortProjects(projects, 'backoffice');
    createProjectComponents(sortedProjects);
    ProjectRequestHelpers.getSystems(setSystems, createSystemComponents);
    stopLoader();
  }, [projectHasBeenSaved]);

  /* Opens the dialog for creating a new project when the user presses the "New project"-button.
  Also resets the values of PROJECT and SYSTEM, to not show previously written values. */
  const handleClickOpen = () => {
    setOpen(true);
    closeProjectDetailInfo();
    CommonHelpers.changeValue(updateField, PROJECT, "")
    CommonHelpers.changeValue(updateField, SYSTEM, "")
  };

  // If the user exits the "New project"-window.
  const handleClose = () => {
    setOpen(false);
  };

  // Opens the delete confirmation dialog.
  const handleOpenConfirmationDialog = () => {
    setOpenConfirmationDialog(true);
  };
  
  // Closes the delete confirmation dialog.
  const handleCloseConfirmationDialog = () => {
    setOpenConfirmationDialog(false);
  };

  /**
   * Generates and loads Project-components into the projectList, from an object containing
   * the projects' data.
   *
   * @param {Object} projectsData 
   */
  function createProjectComponents(projectsData) {
    let projectList = [];
    for (let i = 0; i < projectsData.length; i++) {
      var project = projectsData[i];
      if (projectHeaders.includes(project.name)) {
        projectList.push(<h5 key={project.name} style={{marginLeft:"1em"}}>{project.name}</h5>);
      } else {
        var componentInfo = {};
        componentInfo["Project"] = project.name;
        componentInfo["System"] = project.system;
        projectList.push(
          <DetailListItem
            name={project.name}
            id={project.id}
            key={project.name}
            componentInfo={componentInfo}
            openAndSetClickedListItem={openAndSetClickedListItem}
            editMode={editProjectMode}
          />
        );
      }
    }
    setProjectListState(projectList);
  }

  /**
   * Creates the dropdown menu items for systems.
   *
   * @param {Array} systems The systems to create menu components from.
   */
   function createSystemComponents(systems) {
    let systemList = [];
    for (let i = 0; i < systems.length; i++) {
      var system = systems[i];
      systemList.push(
        <MenuItem value={system} key={system}>{system}</MenuItem>
      );
    }
    setSystems(systemList);
  }

  /**
   * Closes the list of projects.
   */
  function handleCloseProjectList() {
    closeProjectList();
    setEditProjectMode(false);
  }

  /**
   * Closes a project's detail view.
   */
  function handleCloseProjectDetailInfo() {
    closeProjectDetailInfo();
    setEditProjectMode(false);
  }

  /**
   * Generates the select field for choosing the project's system.
   *
   * @param {*} fieldLabel The label of the select field.
   * @param {*} name Name of the select field.
   * @param {*} fieldValue Current value of the select field.
   */
  function selectField(fieldLabel, name, fieldValue) {
    return <>
      <Typography className={classes.paperHeader}>{fieldLabel}</Typography>
        <Select variant="outlined" 
          name={name} 
          value={fieldValue} 
          inputValue={fieldValue}
          onChange={(e) => CommonHelpers.changeValue(updateField, name, e.target.value)} 
          style={{ width: "100%"}}>
          {systems}
        </Select>
    </>  
  }

  /**
   * Validates fieldValues, and evaluates the result to true if the fields are both valid, 
   * and otherwise to false.
   */
  function validateFields() {
    let validateProject = validate(PROJECT, fieldValues[PROJECT]);
    let validateProjectResponsible = validate(PROJECT_RESPONSIBLE, fieldValues[PROJECT_RESPONSIBLE]);
    setProjectValidationState(validateProject);
    setProjectResponsibleValidationState(validateProjectResponsible);
    if (validateProjectResponsible === VALID && validateProject === VALID) {
      return true;
    } else {
      return false;
    }
  }    

  /**
   * Saves the newly created project.
   * 
   * @param {*} event The submit event.
   */
  async function submitProject(event) {
    var result = await ProjectRequestHelpers.createProject(event, fieldValues, validate, 
      setProjectValidationState, setHasBeenSaved);
    if (result === true) {
      handleClose();
      startLoader();
      var projects = await ProjectRequestHelpers.getProjects();
      var sortedProjects = await CommonHelpers.sortProjects(projects);
      createProjectComponents(sortedProjects);
      stopLoader();
    }
  }

  /**
   * Generates the list of projects, the new project button and the dialog for creating 
   * a new project.
   */
  function renderProjectListAndNewButton() {
    return <Box gridColumn={centerWidth} border="1px solid grey">
      <StyledCloseIcon event={handleCloseProjectList} />
      <Grid style={{height: "20%"}}>
        <Paper elevation={2} className={classes.paper}>
          <Typography className={classes.paperHeader}>Projects</Typography>
          {projectListState}
        </Paper>
        <NewButton handleClickOpen={handleClickOpen} type="project" />
        <Dialog open={open} onClose={handleClose}>
          <form id="projectInfo-form" onSubmit={async (event) => await submitProject(event)}
          style={{ height: "100%", width: "100%" }}>
            <DialogContent>
              <InputTextField
                withErrorMessages={true}
                validationState={projectValidationState}
                updateField={updateField}
                name={PROJECT}
                fieldValue={fieldValues[PROJECT]}
                fieldLabel={FieldLabels[PROJECT]}
              />
              <Grid style={{width:"100%", marginTop:"5%"}}>
                  {selectField(FieldLabels[SYSTEM], SYSTEM, fieldValues[SYSTEM])}
              </Grid>
            </DialogContent>
            <DialogActions>
              <SaveButton editMode={true}/>
            </DialogActions>
          </form>
        </Dialog>
      </Grid>
    </Box>
  }
  
  /**
   * Generates the EditInputFields component.
   */
  function renderInputFields() {
    var validationStates = {}
    validationStates['project'] = projectValidationState;
    validationStates['project responsible'] = projectResponsibleValidationState;
    return <EditInputFields
      editMode={editProjectMode} 
      setHasBeenSaved={setHasBeenSaved}
      closeDetailInfo={closeProjectDetailInfo}
      componentDetails={componentDetails}
      validateFields={validateFields}
      validationStates={validationStates}
      setEditMode={setEditProjectMode}
      handleOpenConfirmationDialog={handleOpenConfirmationDialog}
      fieldValues={fieldValues}
      updateField={updateField}
      systems={systems} 
      saveFunction={ProjectRequestHelpers.updateProject}
      type={"project"}
    />
  }

  /**
   * Displays a list of projects, a button for creating a new project, and
   * a project's detail info if the user has opened that view. The buttons
   * "Edit project" and "Delete project" are displayed in the detail view, 
   * and if the user clicks the edit-button, the buttons are replaced with 
   * a "Save"-button.
   */
  return <>
    {projectInfoOpen ? <>
      {renderProjectListAndNewButton()}
      <Box gridColumn={rightWidth} sx={{ marginLeft: 40, marginRight:30 }}>
        <StyledCloseIcon event={handleCloseProjectDetailInfo} />
        {renderInputFields()}
      </Box>
      </> : <>
        {projectListOpen ? <>
          {renderProjectListAndNewButton()}
        </> : null }
      </>}
    <ConfirmationDialog 
      openConfirmationDialog={openConfirmationDialog}
      handleCloseConfirmationDialog={handleCloseConfirmationDialog}
      type={"project"}
      deleteFunction={ProjectRequestHelpers.deleteProject}
      activeItemName={activeItemName}
      setHasBeenSaved={setHasBeenSaved}
      handleCloseDetailInfo={handleCloseProjectDetailInfo}/>
  </>
}