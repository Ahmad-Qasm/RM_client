import { notifySuccess, notifyFailed } from "../../../../../model/helpers/Notifiers";
import { sendGet, sendJson } from "../../../../../model/helpers/network/Network";
import { TASK, ORIGINAL_ESTIMATE, DESCRIPTION } from '../../../../../model/helpers/form/FieldConstants';
import { startLoader, stopLoader } from "../../../../../model/helpers/LoadingIndicator";

/**
 * The requests to the backend for tasks. The requests that tasks need are save, delete, edit and get.
 */
const TaskRequestHelpers = {
    /**
     * Gets the details of the currently selected task.
     * 
     * @param {Number} activeItemId ID of the active item.
     */
    getTaskDetails: async function(activeItemId) {
        try {
            let task = await (
                await sendGet(`http://localhost:5000/task?id=${activeItemId}`)).json();
            return task;
        } catch (error) {
            notifyFailed("Failed to retrieve task");
        }
    },

    /**
     * Saves the changes of the edited task to backend, if input is valid.
     * 
     * @param {Function} validateFields Function for validating taskName and original estimate.
     * @param {Object} fieldValues The values of the input fields.
     * @param {Object} componentDetails Details of the active component.
     * @param {Function} setHasBeenSaved Function that sets hasBeenSaved to true or false.
     * @param {Function} closeTaskDetailInfo Function that closes the detail view of the component.
     */
    updateTask: async function (validateFields, fieldValues, componentDetails, setHasBeenSaved, 
        closeTaskDetailInfo) {
        if (validateFields() === true) {
            const data = { 
                id: componentDetails.id,
                name: fieldValues[TASK],
                originalEstimate: fieldValues[ORIGINAL_ESTIMATE],
                description: fieldValues[DESCRIPTION]
            };
            const serializedData = JSON.stringify(data);
            try {
                const response = await sendJson(`http://localhost:5000/task-update`, serializedData);
                if (response.status === 200) {
                    notifySuccess("Saved task");
                    setHasBeenSaved(true);
                    closeTaskDetailInfo();
                } else {
                    notifyFailed("Failed to save task");
                    setHasBeenSaved(false);
                }
            } catch (error) {
                notifyFailed("Failed to save task");
            }
        }
    },

    /**
     * Fetches all current tasks' data from backend and saves it to taskList.
     * Notifies user in case of error.
     */
    getTasks: async function () {
    try {
        startLoader();
        let tasks = await (
            await sendGet("http://127.0.0.1:5000/tasks?name=")).json(); 
        stopLoader();
        return tasks;
    } catch (error) {
      notifyFailed("Failed to retrieve tasks");
      stopLoader();
    }
  },
  
    /**
     * Saves the newly created task when the "Save" button is pressed.
     * 
     * @param {Event} event - the event associated with the submit.
     * @param {Function} validateFields Function for validating taskName and original estimate.
     * @param {Object} fieldValues The values of the input fields.
     * @param {Function} setTaskHasBeenSaved Function that sets hasBeenSaved to true or false.
     * @param {Function} handleClose Function that closes the new task popup window.
     * @param {Function} createTaskComponents Function that creates the task components.
     */
    createTask: async function (event, validateFields, fieldValues, setTaskHasBeenSaved, handleClose, createTaskComponents) {
        event.preventDefault();
        if (await validateFields(fieldValues[TASK], fieldValues[ORIGINAL_ESTIMATE]) === true) {
            let taskData = {
                name: fieldValues[TASK],
                originalEstimate: fieldValues[ORIGINAL_ESTIMATE]
            };
            const serializedData = JSON.stringify(taskData);
            if(taskData.name !== "") {
                try {
                    const response = await sendJson(`http://localhost:5000/new-task`, serializedData);
                    if (response.status === 200) {
                        notifySuccess("Saved task");
                        setTaskHasBeenSaved(true);
                    } else
                        notifyFailed("Failed to save task");
                } catch (error) {
                    notifyFailed("Failed to save task");
                }
                handleClose();
                var tasks = await this.getTasks();
                createTaskComponents(tasks);
            } else
            notifyFailed("Task name can not be empty!")
        }
    },
  
    /**
     * Deletes the selected task.
     * 
     * @param {Function} handleCloseConfirmationDialog Function that handles the closing of the confirmation dialog.
     * @param {Number} activeItemId ID of the active item.
     * @param {Function} setTaskHasBeenSaved Function that sets hasBeenSaved to true or false.
     * @param {Function} handleCloseTaskDetailInfo Function that handles the closing of the task's detail view.
     */
    deleteTask: async function (handleCloseConfirmationDialog ,activeItemId, setTaskHasBeenSaved, handleCloseTaskDetailInfo) {
        handleCloseConfirmationDialog();
        try {
            const response = 
                await sendJson(`http://127.0.0.1:5000/task-delete?id=${activeItemId}`);
            if (response.status === 200) {
                setTaskHasBeenSaved(true);
                handleCloseTaskDetailInfo();
                notifySuccess("Successfully deleted task");
            } else {
                notifyFailed("Failed to delete task");
            }
        } catch (error) {
            notifyFailed("Failed to delete task");
        }
    }
}

export default TaskRequestHelpers;