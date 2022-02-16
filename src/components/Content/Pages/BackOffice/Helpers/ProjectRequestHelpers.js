import { notifySuccess, notifyFailed } from "../../../../../model/helpers/Notifiers";
import { sendGet, sendJson } from "../../../../../model/helpers/network/Network";
import { PROJECT, SYSTEM, PROJECT_RESPONSIBLE } from '../../../../../model/helpers/form/FieldConstants';
import { startLoader, stopLoader } from "../../../../../model/helpers/LoadingIndicator";
import { VALID } from "../../../../../model/helpers/form/Validator";

/**
 * The requests to the backend for projects. The requests that projects need are save, delete, edit and get.
 */
const ProjectRequestHelpers = {
    /**
     * Gets the details of the currently selected project.
     * 
     * @param {String} activeItemName The name of the active item.
     */
    getProjectDetails: async function (activeItemName) {
        let details = {};
        let system;
        let project;
        try {
            project = await (
                await sendGet(`http://localhost:5000/project?name=${activeItemName}`)).json(); 
            details.project = project.name;
            details.id = project.id;
            details.project_responsible = project.project_responsible;
            details.system = project.system;
            return details;
        } catch (error) {
            notifyFailed("Failed to retrieve project");
        }
    },
    
    /**
    * Saves the changes of the edited project to backend.
    *
    * @param {Function} validateFields Function that runs the validation for the input fields.
    * @param {Object} fieldValues The values of the input fields.
    * @param {Object} componentDetails Details of the active component.
    * @param {Function} setHasBeenSaved Function that sets hasBeenSaved to true or false.
    * @param {Function} closeProjectDetailInfo Function that closes the detail view of the component.
    */
    updateProject: async function (validateFields, fieldValues, componentDetails, setHasBeenSaved, 
    closeProjectDetailInfo) {
        if (validateFields() === true) {
            const data = { 
                id: componentDetails.id,
                name: fieldValues[PROJECT],
                system: fieldValues[SYSTEM],
                project_responsible: fieldValues[PROJECT_RESPONSIBLE]
            };
            const serializedData = JSON.stringify(data);
            try {
                const response = await sendJson(`http://localhost:5000/project/update`, serializedData);
                if (response.status === 200) {
                    notifySuccess("Saved project");
                    setHasBeenSaved(true);
                    closeProjectDetailInfo();
                } else {
                    notifyFailed("Failed to save project");
                    setHasBeenSaved(false);
                }
            } catch (error) {
                notifyFailed("Failed to save project");
            }
        }
    },
    
    /**
     * Fetches all current projects' data from backend and saves it to projectList.
     * Notifies user in case of error.
     */
    getProjects: async function () {
        let projects;
        try {
            startLoader();
            projects = await (
                await sendGet("http://127.0.0.1:5000/projects")).json();
            stopLoader();
            return projects;
        } catch (error) {
            notifyFailed("Failed to retrieve projects");
            stopLoader();
        }
    },
    
    /**
     * Fetches systems' data from backend and saves it to systemList.
     * Notifies user in case of error.
     *
     * @param {Function} setSystems Function that saves the systemlist to state.
     * @param {Function} createSystemComponents Function that creates the system components.
     */
    getSystems: async function (setSystems, createSystemComponents) {
        let systems;
        try {
            startLoader();
            systems = await (
                await sendGet("http://127.0.0.1:5000/systems")).json(); 
            systems.sort((systema,systemb)=>systema.localeCompare(systemb));
            setSystems(systems);
            createSystemComponents(systems);
        } catch (error) {
            notifyFailed("Failed to retrieve systems");
        }
        stopLoader();
    },
 
    /**
     * Saves the newly created project when the "Save" button is pressed.
     *
     * @param {Event} event - the event associated with the submit.
     * @param {Object} fieldValues - The values of the input fields.
     * @param {Function} validate - Function for validating the project name.
     * @param {Function} setProjectValidationState - Function that sets the validation state for project name.
     * @param {Function} setHasBeenSaved - Function that sets hasBeenSaved to true or false.
     */
    createProject: async function (event, fieldValues, validate, setProjectValidationState, setHasBeenSaved) {
        event.preventDefault();
        let projectData = {
            project: fieldValues[PROJECT],
            system: fieldValues[SYSTEM]
        };
        const validationResult = validate(PROJECT, fieldValues[PROJECT]);
        if(validationResult !== VALID) {
            setProjectValidationState(validationResult);
        } else {
            if (projectData.project !== "" && projectData.system !== "") {
                try {
                    const serializedData = JSON.stringify(projectData);
                    const response = await sendJson(`http://localhost:5000/new-project`, serializedData);
                    if (response.status === 200) {
                        if (await response.text() === "project already exists")
                            notifyFailed("project already exists");
                        else {
                            notifySuccess("Saved project");
                            setProjectValidationState(VALID);
                            setHasBeenSaved();
                            return true;
                        }
                    } else
                        notifyFailed("Failed to save project");
                } catch (error) {
                    notifyFailed("Failed to save project");
                }
            } else
            notifyFailed("Project and System must be chosen!");
        }
        return false;
    },

    /**
     * Deletes the selected project.
     * 
     * @param {Function} handleCloseConfirmationDialog Function that handles the closing of the confirmation dialog.
     * @param {String} activeItemName The name of the active item.
     * @param {Function} setHasBeenSaved Function that sets hasBeenSaved to true or false.
     * @param {Function} handleCloseProjectDetailInfo Function that handles the closing of the project's detail view.
     */
    deleteProject: async function (handleCloseConfirmationDialog, activeItemName, setHasBeenSaved, 
        handleCloseProjectDetailInfo) {
        handleCloseConfirmationDialog();
        try {
            const response = 
                await sendJson(`http://127.0.0.1:5000/project-delete?projectName=${activeItemName}`);
            if (response.status === 200) {
                setHasBeenSaved(true);
                handleCloseProjectDetailInfo();
                notifySuccess("Successfully deleted project");
            } else
                notifyFailed("Failed to delete project");
        } catch (error) {
        notifyFailed("Failed to delete project");
        }
    }
}

export default ProjectRequestHelpers;