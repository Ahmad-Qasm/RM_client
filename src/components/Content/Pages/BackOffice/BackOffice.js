import { useState, useEffect } from "react";
import { Box } from "@material-ui/core";
import ProjectListAndDetail from "./Project/ProjectListAndDetail";
import GroupListAndDetail from "./Group/GroupListAndDetail";
import TaskListAndDetail from "./Task/TaskListAndDetail";
import GroupRequestHelpers from "./Helpers/GroupRequestHelpers";
import ProjectRequestHelpers from "./Helpers/ProjectRequestHelpers";
import TaskRequestHelpers from "./Helpers/TaskRequestHelpers";
import BackOfficeList from "./BackOfficeList";
import CommonHelpers from "./Helpers/CommonHelpers";

const listItemProjects = "Projects";
const listItemGroups = "Groups";
const listItemTasks = "Tasks";

/**
 * The BackOffice part of the application where admins can create/read/update/delete
 * groups, projects and tasks.
 */
export default function BackOffice() {
    const [centerWidth, setCenterBoardWidth] = useState("span 8");
    const [rightWidth, setRightBoardWidth] = useState("span 0");
    const [activeItemName, setActiveItemName] = useState("");
    const [activeItemId, setActiveItemId] = useState("");
    const [componentDetails, setComponentDetails] = useState([]);
    // States for project.
    const [projectInfoOpen, setProjectInfoOpen] = useState(false);
    const [projectHasBeenSaved, setProjectHasBeenSaved] = useState(false);
    const [editProjectMode, setEditProjectMode] = useState(false);
    const [projectListOpen, setProjectListOpen] = useState(false);
    // States for group.
    const [groupInfoOpen, setGroupInfoOpen] = useState(false);
    const [groupHasBeenSaved, setGroupHasBeenSaved] = useState(false);
    const [editGroupMode, setEditGroupMode] = useState(false);
    const [groupListOpen, setGroupListOpen] = useState(false);
    // States for task.
    const [taskInfoOpen, setTaskInfoOpen] = useState(false);
    const [taskHasBeenSaved, setTaskHasBeenSaved] = useState(false);
    const [editTaskMode, setEditTaskMode] = useState(false);
    const [taskListOpen, setTaskListOpen] = useState(false);

   /**
    * If the user has just saved an edited item, the edit mode of the component is set
    * to false, and the hasBeenSaved is reset to false.
    */
    useEffect(() => {
        if(groupHasBeenSaved) {
            resetAfterSave(setEditGroupMode, setGroupInfoOpen, setGroupHasBeenSaved);
        } else if(projectHasBeenSaved) {
            resetAfterSave(setEditProjectMode, setProjectInfoOpen, setProjectHasBeenSaved);
        } else if (taskHasBeenSaved) {
            resetAfterSave(setEditTaskMode, setTaskInfoOpen, setTaskHasBeenSaved);
        }
        setActiveItemName("");
    }, [groupHasBeenSaved, projectHasBeenSaved, taskHasBeenSaved]);

    /**
     * Closes detail view when an item has been saved, and resets hasBeenSaved and turns off edit mode.
     * 
     * @param {Function} setEditMode - Handles changing of boolean value editMode.
     * @param {Function} setInfoOpen - Handles changing of boolean value infoOpen.
     * @param {Function} setHasBeenSaved - Handles changing of boolean value hasBeenSaved.
     */
    function resetAfterSave(setEditMode, setInfoOpen, setHasBeenSaved) {
        setEditMode(false);
        setInfoOpen(false);
        setHasBeenSaved(false);
    }
  
    /**
     * Updates editMode in child components. This to avoid changing activeItemName and activeItemId 
     * when a user clicks a different component in the list, while a component is in edit mode.
     */
    useEffect(() => {
        setBoardWidthsToAllOpen();
    }, [editProjectMode, editGroupMode, editTaskMode]);

    /**
     * When the user clicks a new list item, the activeItemId and the
     * details of the item are collected.
     */
    CommonHelpers.useDidMountEffect(async () => {
        if (activeItemName !== "") {
            if (groupListOpen && !editGroupMode) {
                await openItemAndGetDetails(setGroupInfoOpen, GroupRequestHelpers.getGroupDetails, activeItemName);
            } else if (projectListOpen && !editProjectMode) {
                await openItemAndGetDetails(setProjectInfoOpen, ProjectRequestHelpers.getProjectDetails, activeItemName);
            } else if (taskListOpen && !editTaskMode) {
                await openItemAndGetDetails(setTaskInfoOpen, TaskRequestHelpers.getTaskDetails, activeItemId);
            }
        }
    }, [activeItemName]);

    /**
     * Gets the details of the clicked item and opens the detail view of it.
     * 
     * @param {Function} setInfoOpen Toggles the boolean value of opening the detail view.
     * @param {Function} getFunction Gets the details of the item.
     * @param {String} item The clicked item.
     */
    async function openItemAndGetDetails(setInfoOpen, getFunction, item) {
        setInfoOpen(true);
        var details = await getFunction(item);
        setComponentDetails(details);
    }

    /**
     * Opens the list of the selected backoffice item, e.g. projects, groups or tasks.
     * 
     * @param {String} listItem The item clicked.
     */
    function openList(listItem) {
        if (!editGroupMode && !editProjectMode && !editTaskMode) {
            setProjectListOpen(listItem === listItemProjects ? true : false);
            setGroupListOpen(listItem === listItemGroups ? true : false);
            setTaskListOpen(listItem === listItemTasks ? true : false);
            // Closes detail lists of other elements than the one that is opened.
            closeDetailInfo();
            setBoardWidthsToStandard();
        }
    }

    /**
     * Gives the page's grid columns their standard widths.
     */
    function setBoardWidthsToStandard() {
        setCenterBoardWidth("span 8");
        setRightBoardWidth("span 0");
    }

    /**
     * Gives the page's grid columns equal sizes, for when all of 
     * them are visible to the user.
     */
    function setBoardWidthsToAllOpen() {
        setCenterBoardWidth("span 4");
        setRightBoardWidth("span 4");
    }

    /**
     * Shows a list item's detailed info when it's clicked. This function 
     * is passed down to ProjectListItem and GroupListItem.
     * 
     * @param {String} itemName 
     */
    function openAndSetClickedListItem(itemName, itemId = undefined) {
        if (!editGroupMode && !editProjectMode && !editTaskMode) {
            setActiveItemName(itemName);
            if (itemId !== undefined) {
                setActiveItemId(itemId)
            }
            setBoardWidthsToAllOpen();
        }
    }

    /**
     * Closes the opened list when the closebutton is clicked. If a detail
     * view is opened, this will also be closed. The function also restores 
     * the widths of the grid columns to their standard values. This function 
     * is passed down to ProjectDetail, GroupDetail and TaskDetail.
     */
    function closeList() {
        setGroupInfoOpen(false);
        setProjectInfoOpen(false);
        setTaskInfoOpen(false);
        setGroupListOpen(false);
        setProjectListOpen(false);
        setTaskListOpen(false);
        setBoardWidthsToStandard();
    }

    /**
     * Closes the opened detail info when the closebutton is clicked. The function 
     * also restores the widths of the grid columns to their standard values. This 
     * function is passed down to ProjectDetail, GroupDetail and TaskDetail.
     */
    function closeDetailInfo() {
        if (projectInfoOpen) {
            setProjectInfoOpen(false);
            setProjectHasBeenSaved(false);
        } else if (groupInfoOpen) {
            setGroupInfoOpen(false);
            setGroupHasBeenSaved(false);
        } else if (taskInfoOpen) {
            setTaskInfoOpen(false);
            setTaskHasBeenSaved(false);
        }
        setBoardWidthsToStandard();
    }

    /**
     * Displays 1, 2, or 3 columns, depending on if a component is being inspected 
     * in list view or detail view.
     */
    return <Box display="grid" gridTemplateColumns="repeat(12, 1fr)">
        <BackOfficeList 
            leftBoardWidth={"span 4"}
            listItemProjects={listItemProjects}
            listItemGroups={listItemGroups}
            listItemTasks={listItemTasks}
            setBoardWidthsToStandard={setBoardWidthsToStandard}
            openList={openList}
        />

        <ProjectListAndDetail
            centerWidth={centerWidth}
            rightWidth={rightWidth}
            projectInfoOpen={projectInfoOpen}
            closeProjectList={closeList}
            openAndSetClickedListItem={openAndSetClickedListItem}
            closeProjectDetailInfo={closeDetailInfo}
            activeItemName={activeItemName}
            activeItemId={activeItemId}
            setHasBeenSaved={setProjectHasBeenSaved}
            projectHasBeenSaved={projectHasBeenSaved}
            editProjectMode={editProjectMode}
            setEditProjectMode={setEditProjectMode}
            componentDetails={componentDetails}
            projectListOpen={projectListOpen}
        />
        <GroupListAndDetail
            centerWidth={centerWidth}
            rightWidth={rightWidth}
            groupInfoOpen={groupInfoOpen}
            closeGroupList={closeList}
            openAndSetClickedListItem={openAndSetClickedListItem}
            closeGroupDetailInfo={closeDetailInfo}
            activeItemName={activeItemName}
            setGroupHasBeenSaved={setGroupHasBeenSaved}
            groupHasBeenSaved={groupHasBeenSaved}
            editGroupMode={editGroupMode}
            setEditGroupMode={setEditGroupMode}
            componentDetails={componentDetails}
            groupListOpen={groupListOpen}
        />
        <TaskListAndDetail
            centerWidth={centerWidth}
            rightWidth={rightWidth}
            taskInfoOpen={taskInfoOpen}
            closeTaskList={closeList}
            openAndSetClickedListItem={openAndSetClickedListItem}
            closeTaskDetailInfo={closeDetailInfo}
            activeItemName={activeItemName}
            activeItemId={activeItemId}
            setTaskHasBeenSaved={setTaskHasBeenSaved}
            taskHasBeenSaved={taskHasBeenSaved}
            editTaskMode={editTaskMode}
            setEditTaskMode={setEditTaskMode}
            componentDetails={componentDetails}
            taskListOpen={taskListOpen}
        />
    </Box>
}