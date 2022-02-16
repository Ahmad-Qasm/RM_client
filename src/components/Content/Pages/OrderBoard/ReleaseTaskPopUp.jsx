import { useState, useEffect } from 'react';
import { Grid, Button, DialogContent, DialogContentText, DialogActions, Dialog, DialogTitle,
    FormGroup, FormControlLabel, Checkbox} from '@material-ui/core';

import { startLoader, stopLoader } from '../../../../model/helpers/LoadingIndicator';
import { sendGet, sendJson } from '../../../../model/helpers/network/Network';
import { notifyFailed } from '../../../../model/helpers/Notifiers';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TaskDueDates from './TaskDueDates';
import CreateJiraIssues from '../../CreateJiraIssues';

/**
 * Shows the popup window that lets the release manager pick which tasks to perform
 * for the release. There they also set due dates for the tasks. When the button
 * "Save tasks and start calibration" is pressed, the release tasks and their duedates
 * are saved to the database, and the order is moved to the "started" column.
 */
export default function ReleaseTaskPopUp({ orderId, openReleaseTaskPopUp, startReleaseProcess, 
    handleCloseReleaseTaskPopUp, orderDetails, setStoryLink }) {
    const [tasks, setTasks] = useState([]);
    const [taskListState, setTaskListState] = useState();
    const [open, setOpen] = useState(false);
    const [releaseMeetingDate, setReleaseMeetingDate] = useState("");
    
    // Gets available tasks from the database, if they haven't already been collected.
    useEffect(() => {
        getTasks();
        TaskDueDates.getDelorderDates(orderDetails);
    }, [openReleaseTaskPopUp]);

    // When tasks or releaseMeetingDate are updated, the dialog window is updated to reflect the changes.
    useEffect(() => {
        createTaskCheckboxComponents();
    }, [tasks, releaseMeetingDate]);

    // When releaseMeetingDate is updated, its dependent dates are updated.
    useEffect(async () => {
        if (tasks.length > 0) {
            var newTasks = await TaskDueDates.refreshDependentTaskDates(tasks, releaseMeetingDate);
            setTasks(newTasks)
        }
    }, [releaseMeetingDate]);

    const handleClickOpen = (event) => {
        event.preventDefault();
        var checkedTasks = tasks.filter(element => element.checked == true);
        if (checkedTasks.find(element => element.date == null) !== undefined) {
            notifyFailed("Each task must have a date before the calibration can be started.");
        } else {
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    }
      
    /**
     * Gets the available tasks from backend, saves them to state with
     * the additional attributes "date" and "checked", and creates 
     * checkboxcomponents from them.
     */
    async function getTasks() {
        let tasksData;
        try {
          startLoader();
          tasksData = await (
            await sendGet("http://127.0.0.1:5000/tasks?name=")).json(); 
            setTasksAndInitialState(tasksData);
            createTaskCheckboxComponents();
        } catch (error) {
          notifyFailed("Failed to retrieve tasks");
        }
        stopLoader();
    }

    /**
    * Gives each task the extra attributes "checked" and "date", and then
    * saves them to state. The extra attributes are necessary for when the 
    * tasks are saved as taskdates (when the RM starts the calibration).
    * 
    * @param {Array} tasksData The tasks' info from backend.
    */
    function setTasksAndInitialState(tasksData) {
        for (let i = 0; i < tasksData.length; i++) {
            var task = tasksData[i];
            task.checked = false;
            task.date = null;
        }
        setTasks(tasksData);
    }

    /**
     * Creates each tasks list component with their name, a checkbox and a 
     * calendar popup field.
     */
    async function createTaskCheckboxComponents() {
        let taskList = [];
        taskList.push(
            <Grid container direction="row" alignItems="flex-start">
                <Grid item xs="8">
                    <DialogTitle>Task</DialogTitle>
                </Grid>
                <Grid item xs="4">
                    <DialogTitle>Date</DialogTitle>
                </Grid>
            </Grid>
        );
        for (let i = 0; i < tasks.length; i++) {
            var task = tasks[i];
           await TaskDueDates.setTaskDate(task ,releaseMeetingDate);
            taskList.push(
                <Grid container id={task.taskid} direction="row" 
                alignItems="flex-start" spacing={2}>
                    <Grid item xs="8">
                        <FormGroup>
                            <FormControlLabel key={task.taskid} label={task.name}
                                control={<Checkbox 
                                    onChange={handleChange} 
                                    checked={task.checked}
                                    category={task.name}
                                    id={task.taskid}
                                    key={task.taskid}
                                    label={task.name}/>}       
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs="4">
                        <DatePicker selected={task.date} showWeekNumbers calendarStartDay={1}
                        onChange={(date, event) => handleDateChange(date, event)}>
                        {/*The p-tag is to be able to get the id of the task when saving a date!*/}
                            <p id={task.taskid}></p>
                        </DatePicker>
                    </Grid>
                </Grid>
            );
        }
        setTaskListState(taskList);
    }

    /**
     * Handles toggling of the checkboxes.
     * 
     * @param {*} event The event that was triggered.
     */
    function handleChange(event) {
        var task = tasks.find(element => Number(element.taskid) == event.target.id);
        if (task !== undefined) {
            task.checked = event.target.checked;
        }
        createTaskCheckboxComponents();
    }

    /**
     * Saves the newly inserted date to the task's state.
     * 
     * @param {Date} date The new date.
     * @param {*} event The event that was triggered.
     */
     async function handleDateChange(date, event) {
        // The taskid of the task to save the date in, collected from the DOM.
        var taskId = event.target.parentNode.parentNode.parentNode.parentNode.lastElementChild.id;
        if (taskId == "") {
            taskId = undefined;
        }
        var task = await tasks.find(element => Number(element.taskid) == taskId);
        if (task !== undefined) {
            // Only updates the date value if it is new.
            if (date !== task.date) {
                task.date = date;
            } 
            // Saves the date to state if it is the task "Hold release meeting". This because other dates depends
            // on this one.
            if (Number(taskId) == 9) {
                setReleaseMeetingDate(date.toISOString());
            }
            // Re-renders the popup window to display the new date value.
            createTaskCheckboxComponents();
        }
    }

    /**
     * Handles the submit function. If all the checked tasks have a date, they are saved to 
     * backend. The function then closes the popup windows, and starts the release process 
     * for the order.
     */
    async function handleSubmit(event) {
        event.preventDefault();
        var checkedTasks = tasks.filter(element => element.checked == true);
        if (checkedTasks.find(element => element.date == null) !== undefined) {
            notifyFailed("Each task must have a date before the calibration can be started.");
        } else {
            for (let i = 0; i < checkedTasks.length; i++) {
                var task = checkedTasks[i];
                await saveTaskdata(event, task);
            }
            startLoader("jiraLoader");
            var createJiraIssues = new CreateJiraIssues(orderDetails);
            var response = await createJiraIssues.createJiras(checkedTasks);
            var responseText = await response.text();
            if (response.status == 200) {
                setStoryLink(responseText);
                await createJiraIssues.saveOrderStoryLink(responseText);
                handleClose();
                document.getElementById('orderInfo-form').submit();
                startReleaseProcess(orderId);
            } else if (responseText == 'The reporter specified is not a user.') {
                notifyFailed(`Failed creating Jiras: ${responseText}`, 5000);
            } else if (responseText == 'Reporter is required.') {
                notifyFailed(`Failed creating Jiras: ${responseText}`, 5000);
            } else if (responseText == 'You could not be automatically logged in to Jira. Try logging out and in to this website again.') {
                notifyFailed(`Failed creating Jiras: ${responseText}`, 7000);
            } else {
                notifyFailed(`Failed creating Jiras`);
            }
            stopLoader("jiraLoader");
        }
    }

    /**
     * Saves the taskdate to the database. The taskdate is converted to a 
     * utcString to get the right format in backend.
     * 
     * @param {Object} task The task to save.
     */
    async function saveTaskdata(event, task) {
        event.preventDefault();
        var time = await calculateTimeEstimation(task);
        let taskdateData = {
            id: task.id,
            task: task.name,
            date: task.date.toUTCString(),
            timeEstimate: time,
            orderId: orderId
        };
        const serializedData = JSON.stringify(taskdateData);
        try {
            const response = await sendJson(`http://localhost:5000/new-taskdate`, serializedData);
            if (response.status !== 200) 
                notifyFailed("Failed to save task");
        } catch (error) {
            notifyFailed("Failed to save task");
        }
    }

    /**
     * Returns the estimated time in minutes for the task. Is necessary for those cases
     * where the time is calculated by a formula depending on the amount of engines in
     * the order.
     * 
     * @param {Object} task The task to calculate the time estimation for.
     */
    async function calculateTimeEstimation(task) {
        try {
            if (await task !== undefined) {
                if (isNaN(await task.originalEstimate)) {
                    var amountOfEngines = orderDetails.engines.length;
                    var replaced = task.originalEstimate.replace('N', amountOfEngines);
                    replaced = replaced.replace('n', amountOfEngines);
                    var result = eval(replaced);
                    if (isNaN(result)) {
                        throw new Error("Could not calculate estimated time. Please check your formula.");
                    } else {
                        return result;
                    }
                } else {
                    return task.originalEstimate;
                }
            }
        } catch(error) {
            notifyFailed("Could not calculate estimated time. Please check your formula.")
        }
    }

    /**
    * A dialog window with the list of release tasks to choose and pick dates for.
    * Also with a cancel and a submit button.
    */
    return <>
        <Dialog open={openReleaseTaskPopUp}>
            <DialogTitle>{"Release tasks"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Choose the release tasks to perform, and their due dates.
                </DialogContentText>
                <Grid container direction="row" alignItems="flex-start" spacing={2}>
                    <FormGroup>
                        {taskListState}
                    </FormGroup>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseReleaseTaskPopUp} color="primary" autoFocus>
                    Cancel
                </Button>
                <Button form="orderInfo-form" onClick={handleClickOpen} color="primary" type="submit" 
                name="start" style={{ backgroundColor: "#4CBB17", color: "white" }}>
                    Save tasks and start calibration
                </Button>
            </DialogActions>
        </Dialog>

        {/* Display a popup form to confirm user action of starting an order */}
        <Dialog open={open} onClose={handleClose}>
            <div id="jiraLoader" style={{ left: "50%", position: "absolute" }}></div>
            <DialogTitle>{"Start Calibration Process?"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    A calibration is about to start. When calibration has started, a Jira sendout will execute and 
                    you will not be able to edit this order any more. Do you want to proceed?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary" autoFocus>
                    Cancel
                </Button>
                <Button form="orderInfo-form" onClick={handleSubmit} color="primary" type="submit" name="start">
                    Yes, Start
                </Button>
            </DialogActions>
        </Dialog>
    </>
}
