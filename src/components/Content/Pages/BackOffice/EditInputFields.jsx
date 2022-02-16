import { useState, useEffect } from 'react';
import { Grid, Typography, Select } from '@material-ui/core';

import { FieldLabels } from '../../../../model/helpers/form/FieldTemplate';
import * as Consts from '../../../../model/helpers/form/FieldConstants';
import CommonHelpers from './Helpers/CommonHelpers';
import InputTextField from './InputTextField';
import SaveButton from './Buttons/SaveButton';
import EditAndDeleteButtons from './Buttons/EditAndDeleteButtons';
import { inputFieldStyles } from './Helpers/StyleHelpers';

/**
 * Fields for displaying and editing an existing item's data.
 * 
 * @param {*} props { editMode, setHasBeenSaved, closeDetailInfo, componentDetails, 
 * validateFields, validationStates, setEditMode, handleOpenConfirmationDialog, 
 * fieldValues, updateField, systems, saveFunction, type } 
 * editMode - Boolean value telling whether edit mode is on or off.
 * setHasBeenSaved - Boolean value, telling the application whether a component has just been saved.
 * closeDetailInfo - Boolean value, telling whether the detail view should be open or not.
 * componentDetails - Details of the currently chosen item.
 * validateFields - Validation function for TASK and ORIGINAL_ESTIMATE.
 * validationStates - Validation states for the item.
 * setEditMode - Function that sets edit mode to true.
 * handleOpenConfirmationDialog - Handles the opening of the confirmation dialog.
 * fieldValues - Values to save.
 * updateField - Function that is used to update values.
 * systems - A list of systems of a project.
 * saveFunction - The function that saves the changes.
 * type - The type of the item that will be saved or deleted, e.g. group, task or project.
 */
export default function EditInputFields({ editMode, setHasBeenSaved, closeDetailInfo, 
  componentDetails, validateFields, validationStates, setEditMode, handleOpenConfirmationDialog, 
  fieldValues, updateField, systems="", saveFunction, type }) {
  const [inputTextFields, setInputTextFields] = useState([]);
  const classes = inputFieldStyles();
  
  /**
   * Updates input fields with the currently selected item's info.
   */
  CommonHelpers.useDidMountEffect(() => {
    if (type === 'task') {
      var description = componentDetails.description == null ? "" : componentDetails.description;
      CommonHelpers.changeValue(updateField, Consts.TASK, componentDetails.name)
      CommonHelpers.changeValue(updateField, Consts.ORIGINAL_ESTIMATE, componentDetails.originalEstimate.toString())
      CommonHelpers.changeValue(updateField, Consts.DESCRIPTION, description)
    } else if (type ==='group') {
      CommonHelpers.changeValue(updateField, Consts.GROUP, componentDetails['0'].name)
      CommonHelpers.changeValue(updateField, Consts.APPROVER, componentDetails['0'].approver)
      CommonHelpers.changeValue(updateField, Consts.REVIEWER, componentDetails['0'].reviewer)
    } else if (type === 'project') {
      if (componentDetails.project_responsible == null) {
          CommonHelpers.changeValue(updateField, Consts.PROJECT_RESPONSIBLE, "");
      } else {
          CommonHelpers.changeValue(updateField, Consts.PROJECT_RESPONSIBLE, componentDetails.project_responsible);
      }
      CommonHelpers.changeValue(updateField, Consts.PROJECT, componentDetails.project)
      CommonHelpers.changeValue(updateField, Consts.SYSTEM, componentDetails.system)
    }
    createInputTextFields();
  },[componentDetails]);

  // Updates the input field values when they change.
  useEffect(() => {
    createInputTextFields();
  },[fieldValues, editMode, validationStates, componentDetails]);

  /**
   * Creates the input text fields.
   */  
  function createInputTextFields() {
    var textFields = [];
    if (type === 'task') {
      textFields = createTaskInputFields();
    } else if (type === 'group') {
      textFields = createGroupInputFields();
    } else if (type === 'project') {
      textFields = createProjectInputFields();
    }
    setInputTextFields(textFields);
  }

  /**
   * Creates the task input fields.
   */
  function createTaskInputFields() {
    var textfields = [];
    textfields.push(<>
      <InputTextField
        withErrorMessages={true}
        validationState={validationStates['task']}
        isReadOnly={!editMode}
        updateField={updateField}
        name={Consts.TASK}
        fieldValue={fieldValues[Consts.TASK]}
        fieldLabel={FieldLabels[Consts.TASK]}
      />
      <InputTextField
        withErrorMessages={true}
        validationState={validationStates['original estimate']}
        isReadOnly={!editMode}
        updateField={updateField}
        name={Consts.ORIGINAL_ESTIMATE}
        fieldValue={fieldValues[Consts.ORIGINAL_ESTIMATE]}
        fieldLabel={FieldLabels[Consts.ORIGINAL_ESTIMATE]}
      />
      <InputTextField
        withErrorMessages={true}
        validationState={true}
        isReadOnly={!editMode}
        updateField={updateField}
        name={Consts.DESCRIPTION}
        fieldValue={fieldValues[Consts.DESCRIPTION]}
        fieldLabel={FieldLabels[Consts.DESCRIPTION]}
        maxrows={30} 
      />
    </>)
    return textfields;
  }

  /**
   * Creates the group input fields.
   */
  function createGroupInputFields() {
    var textfields = [];
    textfields.push(<>
      <InputTextField
        withErrorMessages={false}
        isReadOnly={!editMode}
        updateField={updateField}
        name={Consts.GROUP}
        fieldValue={fieldValues[Consts.GROUP]}
        fieldLabel={FieldLabels[Consts.GROUP]}
      />
      <InputTextField
        withErrorMessages={false}
        isReadOnly={!editMode}
        updateField={updateField}
        name={Consts.REVIEWER}
        fieldValue={fieldValues[Consts.REVIEWER]}
        fieldLabel={FieldLabels[Consts.REVIEWER]}
      />
      <InputTextField
        withErrorMessages={false}
        isReadOnly={!editMode}
        updateField={updateField}
        name={Consts.APPROVER}
        fieldValue={fieldValues[Consts.APPROVER]}
        fieldLabel={FieldLabels[Consts.APPROVER]}
      />
    </>)
    return textfields;
  }
 
  /**
   * Creates the project input fields.
   */
  function createProjectInputFields() {
    var textfields = [];
    textfields.push(<>
      <InputTextField
        withErrorMessages={true}
        isReadOnly={!editMode}
        updateField={updateField}
        name={Consts.PROJECT}
        validationState={validationStates['project']}
        fieldValue={fieldValues[Consts.PROJECT]}
        fieldLabel={FieldLabels[Consts.PROJECT]}
      />
      {selectField(FieldLabels[Consts.SYSTEM], Consts.SYSTEM, fieldValues[Consts.SYSTEM])}
      <InputTextField
        withErrorMessages={true}
        validationState={validationStates['project responsible']}
        isReadOnly={!editMode}
        updateField={updateField}
        name={Consts.PROJECT_RESPONSIBLE}
        fieldValue={fieldValues[Consts.PROJECT_RESPONSIBLE]}
        fieldLabel={FieldLabels[Consts.PROJECT_RESPONSIBLE]}
      />
    </>)
    return textfields;
  }

  /**
   * Generates the select field for choosing the project's system. If editprojectmode is
   * true, an onchange function is added, and else the field is readonly.
   * 
   * @param {*} fieldLabel The label of the select field.
   * @param {*} name Name of the select field.
   * @param {*} fieldValue Current value of the select field.
   */
  function selectField(fieldLabel, name, fieldValue) {
    if (fieldValue === undefined) {
      fieldValue = "";
    }
    if (editMode) {
      return <>
        <Typography className={classes.paperHeader}>{fieldLabel}</Typography>
        <Select className={classes.paper} size="small" variant="outlined"
          name={name} 
          value={fieldValue} 
          inputValue={fieldValue}
          onChange={(e) => CommonHelpers.changeValue(updateField, name, e.target.value)}>
          {systems}
        </Select>
      </>
    } else {
      return <>
        <InputTextField
          isReadOnly={true}
          updateField={updateField}
          name={name}
          fieldValue={fieldValue}
          fieldLabel={fieldLabel}
        />
      </>
    }
  }

  /**
   * If editmode is on, a save button is displayed, and the field values can
   * be edited by the user. Otherwise the field values are read only.
   */
  return <>
    <Grid alignItems="center" justifyContent="center"> 
      {inputTextFields}
      <br></br>
      <SaveButton
        validateFields={validateFields}
        editMode={editMode}
        saveFunction={saveFunction}
        fieldValues={fieldValues}
        componentDetails={componentDetails}
        setHasBeenSaved={setHasBeenSaved}
        closeDetailInfo={closeDetailInfo}
      />
      <EditAndDeleteButtons 
        editMode={editMode}
        setEditMode={setEditMode}
        handleOpenConfirmationDialog={handleOpenConfirmationDialog}
        type={type}
      />
    </Grid>
  </>
}