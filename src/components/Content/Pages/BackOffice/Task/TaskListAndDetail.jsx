import { useState, useEffect, useReducer } from "react";
import { Box, Grid, Paper, Typography, DialogContent, DialogActions, Dialog } from "@material-ui/core";

import { TASK, ORIGINAL_ESTIMATE } from "../../../../../model/helpers/form/FieldConstants";
import { FieldLabels, FieldTemplate } from '../../../../../model/helpers/form/FieldTemplate';
import * as Consts from "../../../../../model/helpers/form/FieldConstants";
import { validate, VALID } from '../../../../../model/helpers/form/Validator';
import StyledCloseIcon from "../../../../../model/helpers/button/StyledCloseIcon";
import DetailListItem from "../DetailListItem";
import TaskRequestHelpers from "../Helpers/TaskRequestHelpers";
import { listAndDetailStyles } from "../Helpers/StyleHelpers";
import ConfirmationDialog from "../ConfirmationDialog";
import CommonHelpers from "../Helpers/CommonHelpers";
import SaveButton from "../Buttons/SaveButton";
import InputTextField from "../InputTextField";
import NewButton from "../Buttons/NewButton";
import EditInputFields from "../EditInputFields";

/**
 * The list of tasks, the detail view of an individual task, and the dialog for 
 * creating a new task.
 * 
 * @param {*} props { taskInfoOpen, closeTaskList, openAndSetClickedListItem, 
 * closeTaskDetailInfo, centerWidth, rightWidth, setTaskHasBeenSaved, 
 * editTaskMode, setEditTaskMode, activeItemId, taskHasBeenSaved, 
 * componentDetails, taskListOpen }
 * 
 * taskInfoOpen - Boolean value telling whether or not to display the task's detail info.
 * closeTaskList - Function passed from BackOffice.
 * openAndSetClickedListItem - Function passed from BackOffice.
 * closeTaskDetailInfo - Function passed from BackOffice.
 * centerWidth - Size of the center box.
 * rightWidth - Size of the right box.
 * setTaskHasBeenSaved - Function passed from BackOffice.
 * editTaskMode - Boolean value telling whether the user is in edit task mode.
 * setEditTaskMode - Function passed from BackOffice.
 * activeItemId - The id of the currently chosen list item.
 * taskHasBeenSaved - Boolean value telling whether a task has just been saved.
 * componentDetails - Details of the currently chosen list item.
 * taskListOpen - Boolean value telling whether or not to display the list of tasks.
 */
export default function TaskListAndDetail({ taskInfoOpen, closeTaskList, openAndSetClickedListItem, 
  closeTaskDetailInfo, centerWidth, rightWidth, setTaskHasBeenSaved, editTaskMode, setEditTaskMode, 
  activeItemId, taskHasBeenSaved, componentDetails, taskListOpen }) {
  const classes = listAndDetailStyles();
  const [taskListState, setTaskListState] = useState([]);
  const [open, setOpen] = useState(false);
  const [fieldValues, updateField] = useReducer(CommonHelpers.valueReducer, 
    FieldTemplate[Consts.TASK, Consts.ORIGINAL_ESTIMATE, Consts.DESCRIPTION]);
  const [taskValidationState, setTaskValidationState] = useState(true);
  const [originalEstimateValidationState, setOriginalEstimateValidationState] = useState(true);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

  // Fetches tasks from backend on first page render.
  useEffect(async () => {
    var tasks = await TaskRequestHelpers.getTasks();
    createTaskComponents(tasks);
  },[]);

  // Fetches tasks from backend when a task has been saved.
  useEffect(async () => {
    var tasks = await TaskRequestHelpers.getTasks();
    createTaskComponents(tasks);
  }, [taskHasBeenSaved, editTaskMode]);

  /* Opens the dialog for creating a new task when the user presses the "New task"-button.
  Also resets the values of TASK and ORIGINAL_ESTIMATE, to not show previously written values. */
  const handleClickOpen = () => {
    setOpen(true);
    closeTaskDetailInfo();
    CommonHelpers.changeValue(updateField, TASK, "");
    CommonHelpers.changeValue(updateField, ORIGINAL_ESTIMATE, "");
  };

  // If the user exits the "New task"-window.
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
   * Validates fieldValues, and evaluates the result to true if the fields are both valid, 
   * and otherwise to false.
   */
  function validateFields() {
    let taskStatus = validate(TASK, fieldValues[TASK]);
    let originalEstimateStatus = validate(ORIGINAL_ESTIMATE, fieldValues[ORIGINAL_ESTIMATE]);
    setTaskValidationState(taskStatus);
    setOriginalEstimateValidationState(originalEstimateStatus);

    if (taskStatus === VALID && originalEstimateStatus === VALID) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Generates and loads Task-components into the taskList, from an object containing
   * the tasks' data.
   * 
   * @param {Object} tasksData 
   */
  function createTaskComponents(tasksData) {
    let taskList = [];
    for (let i = 0; i < tasksData.length; i++) {
      var task = tasksData[i];
      var componentInfo = {};
      componentInfo["Task name"] = task.name;
      componentInfo["Original Estimate*min"] = task.originalEstimate;

      taskList.push(
        <DetailListItem
          name={task.name}
          id={task.id}
          key={task.id}
          componentInfo={componentInfo}
          openAndSetClickedListItem={openAndSetClickedListItem}
          editMode={editTaskMode}
        />
      );
    }
    setTaskListState(taskList);
  }

  /**
   * Closes the list of tasks.
   */
  function handleCloseTaskList() {
    closeTaskList();
    setEditTaskMode(false);
  }

  /**
   * Closes a task's detail view.
   */
  function handleCloseTaskDetailInfo() {
    closeTaskDetailInfo();
    setEditTaskMode(false);
  }

  /**
   * Generates the list of tasks, the new task button and the dialog for creating 
   * a new task.
   */
  function renderTaskListAndNewButton() {
    return <Box gridColumn={centerWidth} border="1px solid grey">
      <StyledCloseIcon event={handleCloseTaskList} />
      <Grid style={{height: "20%"}}>
        <Paper elevation={2} className={classes.paper}>
          <Typography className={classes.paperHeader}>Tasks</Typography>
          {taskListState}
        </Paper>
        <NewButton handleClickOpen={handleClickOpen} type="task" />

        <Dialog open={open} onClose={handleClose} className={classes.dialog}> 
          <form id="taskInfo-form" onSubmit={async (event) => await TaskRequestHelpers.createTask(event, validateFields, 
          fieldValues, setTaskHasBeenSaved, handleClose, createTaskComponents)} 
          style={{ height: "100%", width: "100%", zIndex: "9999" }}>
            <DialogContent>
              <InputTextField
                withErrorMessages={true}
                updateField={updateField}
                name={TASK}
                fieldValue={fieldValues[TASK]}
                fieldLabel={FieldLabels[TASK]}
                validationState={taskValidationState}
              />
              <InputTextField
                withErrorMessages={true}
                updateField={updateField}
                name={ORIGINAL_ESTIMATE}
                fieldValue={fieldValues[ORIGINAL_ESTIMATE]}
                fieldLabel={FieldLabels[ORIGINAL_ESTIMATE]}
                validationState={originalEstimateValidationState}
              />
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
   * Generates the EditTaskInputFields component.
   */
  function renderInputFields() {
    var validationStates = {}
    validationStates['task'] = taskValidationState
    validationStates['original estimate'] = originalEstimateValidationState
    return <EditInputFields
      editMode={editTaskMode}
      setHasBeenSaved={setTaskHasBeenSaved}
      closeDetailInfo={closeTaskDetailInfo} 
      componentDetails={componentDetails}
      validateFields={validateFields}
      validationStates={validationStates}
      setEditMode={setEditTaskMode}
      handleOpenConfirmationDialog={handleOpenConfirmationDialog} 
      fieldValues={fieldValues}
      updateField={updateField}
      saveFunction={TaskRequestHelpers.updateTask}
      type={"task"}
    />
  }

  /**
   * Displays a list of tasks, a button for creating a new task, and
   * a task's detail info if the user has opened that view. The buttons
   * "Edit task" and "Delete task" are displayed in the detail view, 
   * and if the user clicks the edit-button, the buttons are replaced with 
   * a "Save"-button.
   */
  return <>
    {taskInfoOpen ? <>
      {renderTaskListAndNewButton()}
      <Box gridColumn={rightWidth} sx={{ marginLeft: 40, marginRight:30 }}>
        <StyledCloseIcon event={handleCloseTaskDetailInfo} />
        {renderInputFields()}
      </Box>
    </> : <>
      {taskListOpen ? <>
        {renderTaskListAndNewButton()}
      </> : null }
    </>}
    <ConfirmationDialog 
      openConfirmationDialog={openConfirmationDialog}
      handleCloseConfirmationDialog={handleCloseConfirmationDialog}
      type={"task"}
      deleteFunction={TaskRequestHelpers.deleteTask}
      activeItemName={activeItemId}
      setHasBeenSaved={setTaskHasBeenSaved}
      handleCloseDetailInfo={handleCloseTaskDetailInfo}
    />
  </>
}