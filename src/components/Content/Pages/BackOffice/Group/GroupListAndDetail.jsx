import { useState, useEffect, useReducer } from "react";
import { Box, Grid, Paper, Typography, DialogContent, DialogActions, Dialog } from "@material-ui/core";

import { GROUP, REVIEWER, APPROVER } from '../../../../../model/helpers/form/FieldConstants'
import { FieldLabels, FieldTemplate } from '../../../../../model/helpers/form/FieldTemplate';
import * as Consts from '../../../../../model/helpers/form/FieldConstants'
import StyledCloseIcon from "../../../../../model/helpers/button/StyledCloseIcon";
import DetailListItem from "../DetailListItem";
import GroupRequestHelpers from "../Helpers/GroupRequestHelpers";
import { listAndDetailStyles } from "../Helpers/StyleHelpers";
import ConfirmationDialog from "../ConfirmationDialog";
import CommonHelpers from "../Helpers/CommonHelpers";
import InputTextField from "../InputTextField";
import SaveButton from "../Buttons/SaveButton";
import NewButton from "../Buttons/NewButton";
import EditInputFields from "../EditInputFields";

/**
 * The list of groups, the detail view of an individual group, and the dialog for creating a new
 * group.
 * 
 * @param {*} props { groupInfoOpen, closeGroupList, openAndSetClickedListItem, 
 * closeGroupDetailInfo, activeItemName, centerWidth, rightWidth, setGroupHasBeenSaved, 
 * editGroupMode, setEditGroupMode, groupHasBeenSaved, componentDetails, groupListOpen }
 * groupInfoOpen - Boolean value telling whether or not to display the group's detail info.
 * closeGroupList - Function passed from BackOffice.
 * openAndSetClickedListItem - Function passed from BackOffice.
 * closeGroupDetailInfo - Function passed from BackOffice.
 * activeItemName - Name of the currently chosen list item.
 * centerWidth - Size of the center box.
 * rightWidth - Size of the right box.
 * setGroupHasBeenSaved - Function passed from BackOffice.
 * editGroupMode - Boolean value telling whether the user is in edit group mode.
 * setEditGroupMode - Function passed from BackOffice.
 * groupHasBeenSaved - Boolean value telling whether a group has just been saved.
 * componentDetails - Details of the currently chosen list item.
 * groupListOpen - State for when the list of groups should be open.
 */
export default function GroupListAndDetail({ groupInfoOpen, closeGroupList, 
  openAndSetClickedListItem, closeGroupDetailInfo, activeItemName, centerWidth, rightWidth, 
  setGroupHasBeenSaved, editGroupMode, setEditGroupMode, groupHasBeenSaved, componentDetails, 
  groupListOpen }) {
    const classes = listAndDetailStyles();
    const [groupListState, setGroupListState] = useState([]);
    const [open, setOpen] = useState(false);
    const [fieldValues, updateField] = useReducer(CommonHelpers.valueReducer, 
      FieldTemplate[Consts.GROUP, Consts.REVIEWER, Consts.APPROVER]);
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

  // Fetches groups from backend on first page render.
  useEffect(async () => {
    var groups = await GroupRequestHelpers.getGroups();
    createGroupComponents(groups);
  },[]);

 // Fetches groups from backend when a group has been saved.
  useEffect(async () => {
    var groups = await GroupRequestHelpers.getGroups();
    createGroupComponents(groups);
  }, [groupHasBeenSaved]);

 /* Opens the dialog for creating a new group when the user presses the "New group"-button.
  Also resets the values of GROUP, APPROVER and REVIEWER, to not show previously written 
  values. */
  const handleClickOpen = () => {
    setOpen(true);
    closeGroupDetailInfo();
    CommonHelpers.changeValue(updateField, GROUP, "");
    CommonHelpers.changeValue(updateField, APPROVER, "");
    CommonHelpers.changeValue(updateField, REVIEWER, "");
  };

  // If the user exits the "New group"-window.
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
   * Generate and load Group-components into the groupList, from an object containing
   * the groups' data.
   * @param {Object} groupData 
   */
  function createGroupComponents(groupData) {
    let groupList = [];
    for (let i = 0; i < groupData.length; i++) {
      var group = groupData[i];
      var componentInfo = {};
      componentInfo["ID"] = group.id;
      componentInfo["Name"] = group.name;
      componentInfo["Reviewer"] = group.reviewer;
      componentInfo["Approver"] = group.approver;
      groupList.push(
        <DetailListItem
          name={group.name}
          id={group.id}
          key={group.name}
          componentInfo={componentInfo}
          openAndSetClickedListItem={openAndSetClickedListItem}
          editMode={editGroupMode}
        />
      );
    }
    setGroupListState(groupList);
  }

  /**
   * Closes the list of groups.
   */
  function handleCloseGroupList() {
    closeGroupList();
    setEditGroupMode(false);
  }

  /**
   * Closes a group's detail view.
   */
  function handleCloseGroupDetailInfo() {
    closeGroupDetailInfo();
    setEditGroupMode(false);
  }

  /**
   * Generates the EditGroupInputFields component.
   */
  function renderInputFields() {
    return <EditInputFields
      editMode={editGroupMode} 
      setHasBeenSaved={setGroupHasBeenSaved}
      closeDetailInfo={closeGroupDetailInfo} 
      componentDetails={componentDetails}
      setEditMode={setEditGroupMode}
      handleOpenConfirmationDialog={handleOpenConfirmationDialog}
      fieldValues={fieldValues}
      updateField={updateField}
      saveFunction={GroupRequestHelpers.updateGroup}
      type={"group"}
    />
  }
  
  /**
   * Generates the list of groups, the "New Group" button, and the form for creating a new group.
   */
  function renderGroupListAndNewButton() {
    return <Box gridColumn={centerWidth} border="1px solid grey">
      <StyledCloseIcon event={handleCloseGroupList} />
      <Grid style={{height: "50%"}}>
        <Paper elevation={2} className={classes.paper}>
          <Typography className={classes.paperHeader}>Groups</Typography>
          {groupListState}
        </Paper>
        <NewButton handleClickOpen={handleClickOpen} type="group" />
        <Dialog open={open} onClose={handleClose}>
          <form id="groupInfo-form"
          onSubmit={async (event) => await GroupRequestHelpers.createGroup(event, fieldValues, 
            setGroupHasBeenSaved, handleClose)} 
          style={{ height: "100%", width: "100%" }}>
          <DialogContent>
            <InputTextField
              updateField={updateField}
              name={GROUP}
              fieldValue={fieldValues[GROUP]}
              fieldLabel={FieldLabels[GROUP]}
            />
             <InputTextField
              updateField={updateField}
              name={REVIEWER}
              fieldValue={fieldValues[REVIEWER]}
              fieldLabel={FieldLabels[REVIEWER]}
            />
            <InputTextField
              updateField={updateField}
              name={APPROVER}
              fieldValue={fieldValues[APPROVER]}
              fieldLabel={FieldLabels[APPROVER]}
            />
          </DialogContent>
          <DialogActions>
            <SaveButton
              editMode={true}
            />
          </DialogActions>
          </form>
        </Dialog>
      </Grid>
    </Box>
  }

  /**
   * Displays a list of the groups and a "New Group" button. It also shows a group's 
   * detailed info if the user has opened that view. The buttons "Edit Group" and "Delete Group" 
   * are displayed in that view, and if the user clicks the edit group-button, the buttons 
   * are replaced with a "Save"-button.
   */
  return <>
    {groupListOpen ? <>
      {renderGroupListAndNewButton()}
      {groupInfoOpen ? <>
        <Box gridColumn={rightWidth} sx={{ marginLeft: 40, marginRight:30 }}>
          <StyledCloseIcon event={handleCloseGroupDetailInfo} />
          {renderInputFields()}
        </Box>
      </> : null} 
    </> : null}
    <ConfirmationDialog 
      openConfirmationDialog={openConfirmationDialog}
      handleCloseConfirmationDialog={handleCloseConfirmationDialog}
      type={"group"}
      deleteFunction={GroupRequestHelpers.deleteGroup}
      activeItemName={activeItemName}
      setHasBeenSaved={setGroupHasBeenSaved}
      handleCloseDetailInfo={handleCloseGroupDetailInfo}
    />
  </>
}
