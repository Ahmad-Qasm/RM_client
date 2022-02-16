import { sendJson } from '../../model/helpers/network/Network';

/**
 * Class for the creation of jira issues. Is called in ReleaseTaskPopUp.
 */
export default class CreateJiraIssues {
    constructor(orderDetails) {
        this.orderDetails = orderDetails;
    }

    /**
     * Calculates fixVersion based on the date of the task.
     * 
     * @param {Date} taskDate The date of the task.
     * @returns {String} fixVersion
     */
    getFixVersion(taskDate) {
    // Calculates the week number of the given date
    var oneJan = new Date(taskDate.getFullYear(),0,1);
    var numberOfDays = Math.floor((taskDate - oneJan) / (24 * 60 * 60 * 1000));
    var weekNumber = String(Math.ceil(( taskDate.getDay() + 1 + numberOfDays) / 7));
    // Adds a 0 in the beginning of the weeknumber if it is one digit.
    if (weekNumber.length == 1) {
        weekNumber = "0" + weekNumber;
    }
    var year = String(taskDate.getFullYear());
    var fixVersion = "v" + year.substring(2) + weekNumber;
    return fixVersion;
}

/**
 * Gets the due date of the story, which is 7 days after the latest task due date.
 * 
 * @param {Array} checkedTasks The release tasks that the user has chosen. 
 * @returns {Date} The due date of the story.
 */
 getStoryDate(checkedTasks) {
    if (checkedTasks.length <= 0) {
        return new Date();
    } else {
        var sortedTasks = checkedTasks.sort((taska,taskb)=>taska.fixVersion.localeCompare(taskb.fixVersion));
        var latestDate = sortedTasks[sortedTasks.length - 1].date;
        var datecopy = new Date(latestDate);
        var datePlusSeven = new Date(datecopy.setDate(datecopy.getDate() + 7));
        return datePlusSeven;
    }
}

/**
 * Assembles name of the story.
 * TODO: Implement rules for which engines to have in the story name.
 * 
 * @returns {String} Name of the story.
 */
assembleJiraIssueSummary(issueType, taskName = "") {
    var customer = this.orderDetails.customer;
    var sop = this.orderDetails.sopSocop;
    var system = this.orderDetails.system;
    var bswVersion = this.orderDetails.bswVersion;
    var engines = this.orderDetails.engines;
    // Determine the engine types by getting the first 4 charechters from the engine.
    var engineTypes = [];
    for (let i = 0; i < engines.length; i++) {
        var engine = engines[i].name.slice(0, 4);
        if (!engineTypes.includes(engine)) {
            engineTypes.push(engine);
        }
        if (engineTypes.length >= 3) {
            break;
        }
    }
    var engineString = "";
    for (let i = 0; i < engineTypes.length; i++) {
        var engine = engineTypes[i];
        engineString += engine;
        if (i !== engineTypes.length - 1) {
            engineString += ", ";
        }
    }
    var amountOfEngines = this.orderDetails.engines.length;
    var typeOfRelease = this.orderDetails.typeOfRelease;

    if (issueType == 'Story') {
        return `${customer}: SOP${sop}, ${system}, SW ${bswVersion},` +
        `${engineString}, QTY:${amountOfEngines} ENG, ${typeOfRelease}`;
    } else if (issueType == 'Task') {
        return `${customer}: SOP${sop}, SW ${bswVersion}, ${engineString}, ${typeOfRelease}` +
        ` - ${taskName}`;
    } else {
        return "summary";
    }
}

/**
 * Creates the description as a table of information about the engines.
 * 
 * @returns {String} The resulting string.
 */
createJiraStoryDescription() {
    var result = "*Engine types and review requirements*\n||Engine Type||Power||" 
        + "Emission standard||SW-release||Status-Requiered||\n";
    var bswVersion = this.orderDetails.bswVersion;
    var status = this.orderDetails.status;

    for (let i = 0; i < this.orderDetails.engines.length; i++) {
        var engineType = this.orderDetails.engines[i].name;
        var power = this.orderDetails.engines[i].power == '' ? '-' : this.orderDetails.engines[i].power;
        var emissionStandard = this.orderDetails.engines[i].emissionStandard;
        result += `|${engineType}|${power}|${emissionStandard}|${bswVersion}|${status}|\n`;
    }
    return result;
}

/**
 * Sets fixVersion, reporter and type for each task, and then creates Jira issues of them.
 * 
 * @param {Array} tasks The tasks to create jira issues for.
 * @returns status of the response.
 */
async createJiras(tasks) {
    var result = [];
    var reporter = "not specified";
    if (this.orderDetails.project_responsible !== "") {
        reporter = this.orderDetails.project_responsible;
    }
    for (let i = 0; i < tasks.length; i++) {
        var task = tasks[i];
        task.fixVersion = this.getFixVersion(task.date);
        task.reporter = reporter;
        task.type = 'Task';
        task.summary = this.assembleJiraIssueSummary('Task', task.name);
        // Assignee is set to project responsible (reporter) until we have the comptrans API.
        task.assignee = reporter;
        result.push(task);
    }
    var story = {};
    var storyDate = this.getStoryDate(result);
    var storyFixVersion = this.getFixVersion(storyDate);
    story.fixVersion = storyFixVersion;
    story.reporter = reporter;
    story.type = 'Story';
    story.date = storyDate;
    story.summary = this.assembleJiraIssueSummary('Story');
    story.description = this.createJiraStoryDescription();
    story.assignee = reporter;
    result.unshift(story);

    // Needed to get the session cookies for jira and be automatically logged in.
    var session = {};
    session.type = 'session';
    session.jira_session = JSON.parse(localStorage.getItem('jira_session'));
    result.unshift(session);

    const serializedData = JSON.stringify(result);
    const response = await sendJson(`http://localhost:5000/new-jira`, serializedData);
    return response;
}

/**
 * Saves the link to the Jira Story to the order in the database.
 * 
 * @param {String} link The jira Story link.
 */
async saveOrderStoryLink(link) {
    var orderId = this.orderDetails.id;
    var data = {id: orderId, storyLink: link};
    const serializedData = JSON.stringify(data);
    await sendJson(`http://localhost:5000/order/update-storylink`, serializedData);
}
}