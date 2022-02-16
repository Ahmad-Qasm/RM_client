import { notifySuccess, notifyFailed } from "../../../../../model/helpers/Notifiers";
import { sendGet, sendJson } from "../../../../../model/helpers/network/Network";
import { GROUP,REVIEWER,APPROVER } from '../../../../../model/helpers/form/FieldConstants';
import { startLoader, stopLoader } from "../../../../../model/helpers/LoadingIndicator";

/**
 * The requests to the backend for groups. The requests that groups need are save, delete, edit and get.
 */
const GroupRequestHelpers = {   
  /**
   * Gets the details of the currently selected group.
   * 
   * @param {String} activeItemName The name of the active item.
   */
  getGroupDetails: async function (activeItemName) {
    let group;
    try {
      group = await (
        await sendGet(`http://localhost:5000/groups?name=${activeItemName}`)).json(); 
      return group;
    } catch (error) {
      notifyFailed("Failed to retrieve group");
    }
  },
      
  /**
   * Saves the changes of the group to backend.
   * 
   * @param {Object} fieldValues Values in the input fields.
   * @param {Object} componentDetails Details of the active component.
   * @param {Function} setGroupHasBeenSaved Function that sets groupHasBeenSaved to true or false.
   * @param {Function} closeGroupDetailInfo Function that closes the detail view of the component.
   */
  updateGroup: async function (fieldValues, componentDetails, setGroupHasBeenSaved, closeGroupDetailInfo) {
    let groupData = {
      id: componentDetails[0].id,
      name: fieldValues[GROUP],
      approver: fieldValues[APPROVER],
      reviewer: fieldValues[REVIEWER]
    };
    const serializedData = JSON.stringify(groupData);
    try {
      const response = 
        await sendJson(`http://localhost:5000/group-update`, serializedData);
      if (response.status === 200) {
        notifySuccess("Saved group");
        setGroupHasBeenSaved(true);
        closeGroupDetailInfo();
      } else
        notifyFailed("Failed to save group");
    } catch (error) {
      notifyFailed("Failed to save group");
    }
  },

  /**
  * Deletes the selected group.
  * 
  * @param {Function} handleCloseConfirmationDialog Function that handles closing of the confirmation dialog.
  * @param {String} activeItemName The name of the active item.
  * @param {Function} setGroupHasBeenSaved Function that sets groupHasBeenSaved to true or false.
  * @param {Function} handleCloseGroupDetailInfo Function that handles the closing of a group's detail info.
  */
  deleteGroup: async function (handleCloseConfirmationDialog, activeItemName, setGroupHasBeenSaved, 
    handleCloseGroupDetailInfo) {
    handleCloseConfirmationDialog();
    try {
      const response = 
        await sendJson(`http://127.0.0.1:5000/group-delete?groupName=${activeItemName}`);
      if (response.status === 200) {
        setGroupHasBeenSaved(true);
        handleCloseGroupDetailInfo();
        notifySuccess("Deleted group");
      } else
        notifyFailed("Failed to delete group");
    } catch (error) {
      notifyFailed("Failed to delete group");
    }
  },
    
  /**
   * Fetches all current groups' data from backend and saves it to groupList.
   * Notifies user in case of error.
   */
  getGroups: async function () {
    let groups;
    try {
      startLoader();
      groups = await (
        await sendGet("http://localhost:5000/groups?name=")).json(); 
      stopLoader();
      return groups;
    } catch (error) {
      notifyFailed("Failed to retrieve groups");
      stopLoader();
    }
  },

  /**
   * Saves the newly created group when the "Save" button is pressed.
   *
   * @param {Event} event - the event associated with the submit.
   * @param {Object} fieldValues - Values of the input fields.
   * @param {Function} setGroupHasBeenSaved Function that sets groupHasBeenSaved to true or false.
   * @param {Function} handleClose Function that sets the open state of the create new group window to false.
   */
  createGroup: async function (event, fieldValues, setGroupHasBeenSaved, handleClose) {
    event.preventDefault();
    let groupData = {
      name: fieldValues[GROUP],
      approver: fieldValues[APPROVER],
      reviewer: fieldValues[REVIEWER]
    };
    const serializedData = JSON.stringify(groupData);
    try {
      const response = await sendJson(`http://127.0.0.1:5000/new-group`, serializedData);
      if (response.status === 200) {
        notifySuccess("Saved group");
        setGroupHasBeenSaved();
      } else
        notifyFailed("Failed to save group");
    } catch (error) {
      notifyFailed("Failed to save group");
    }
    handleClose();
    this.getGroups();
    stopLoader();
  }  
}

export default GroupRequestHelpers;