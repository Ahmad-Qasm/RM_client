import { DateTime } from 'luxon';

var delOrderDates = [];

/**
 * Calculates due dates for the release tasks.
 */
const TaskDueDates = {
    /**
     * Collects all delOrderDates from orderDetails and converts them to DateTime format.
     * 
     * @param {Object} orderDetails Details of the active order. This data is passed from ReleaseTaskPopUp.
     * @returns {Object} All delOrderDates in correct format.
     */
    getDelorderDates: async function(orderDetails) {
        if (orderDetails !== undefined) {
            this.orderDetails = orderDetails;
        } 
        var delorders = {
            'delOrderADate': this.orderDetails['delOrderADate'], 
            'delOrderBDate': this.orderDetails['delOrderBDate'],
            'delOrderCDate': this.orderDetails['delOrderCDate'], 
            'delOrderDDate': this.orderDetails['delOrderDDate'], 
            'delOrderEDate': this.orderDetails['delOrderEDate'], 
            'delOrderFDate': this.orderDetails['delOrderFDate']
        };
        var parsedDelOrderDates = [];
        for (const [key, value] of Object.entries(delorders)) {
            // If the delorder has a date.
            if (value !== "") {
                var year = value.substr(1, 2);
                var week = value.substr(3, 5);
                // The dates should always be on Fridays, therefore there is a '5' in the end of the date string.
                var date = DateTime.fromISO(`20${year}-W${week}-5`);
                const newDateState = {[key]: date }
                parsedDelOrderDates.push(newDateState);
                delOrderDates = parsedDelOrderDates
            } else {
                const newDateState = {[key]: "" }
                parsedDelOrderDates.push(newDateState);
                delOrderDates = parsedDelOrderDates;
            }
        }
        return delOrderDates
    },

     /**
     * Gets the latest delOrderDate from delOrderA to delOrderE. This date is needed since several of the other
     * date calculations depends on it.
     */
      getLatestDelOrderDate: async function() {
        var delOrderDates = await this.getDelorderDates(this.orderDetails);
        var delOrderDatesWithValues = delOrderDates.filter(function (delorderDate) {
            return Object.values(delorderDate)[0] !== "" && Object.values(delorderDate)[0] !== null;
        });
        var latestDelOrder = Object.keys(delOrderDatesWithValues[delOrderDatesWithValues.length-1])[0];
        // DelOrderFDate should not be included in the calculation, and will therefore be removed if it exists.
        if (latestDelOrder == 'delOrderFDate') {
            if (delOrderDatesWithValues.length <= 1) {
                return null;
            } else {
                delOrderDatesWithValues.pop();
            }
        }
        var latestDelOrderDate = Object.values(delOrderDatesWithValues[delOrderDatesWithValues.length-1]);
        return latestDelOrderDate;
    },

    /**
     * Gets the latest delOrderDate from delOrderA to delOrderE, minus ten days.
     */
    getLatestDelOrderDateMinusTenDays: async function() {
        var latestDelOrderDate = await this.getLatestDelOrderDate();
        latestDelOrderDate = latestDelOrderDate[0];
        if (latestDelOrderDate !== null) {
            var result = await latestDelOrderDate.plus({ days: -10 });
            return result;
        }
        return null;
    },
    
    /**
     * Calculates the due date for the task "Build structure in ECOplan, EAST, OAS and SCAT (in this order)".
     * If (latestDelOrderDate - 10 days) is on a Friday, the due date should be that date + 3 days. Else the
     * due date should be that date + 1 day.
     */
    getDueDateForBuildStructureInECOPlan: async function() {
        var dueDate = "";
        var latestDelOrderDate = await this.getLatestDelOrderDateMinusTenDays();
        if (latestDelOrderDate !== null) {
            var weekday = latestDelOrderDate.toFormat('cccc');
            if (weekday === 'Friday') {
                dueDate = latestDelOrderDate.plus({ days: 3 });
                return dueDate;
            }
            dueDate = latestDelOrderDate.plus({ days: 1 });
            return dueDate;
        }
        return null;
    },
    
    /**
     * Gets due date of delOrder E.
     * 
     * @returns The due date of delOrder E.
     */
    getDueDateDelOrderE: async function() {
        var delOrderDates = await this.getDelorderDates(this.orderDetails);
        var dueDateDelOrderE = delOrderDates[4].delOrderEDate;
        if (dueDateDelOrderE == null || dueDateDelOrderE == "") {
            return null;
        } 
        dueDateDelOrderE = new Date(dueDateDelOrderE.toISODate());
        return dueDateDelOrderE;
    },
    
    /**
     * Calculates the different tasks' due dates.
     * @param {String} task The task to get date for. 
     */
    getTaskDate: async function(task, releaseMeetingDate) {
        var dateIsDefined = (task.date !== null && task.date !== undefined && task.date !== "");
        switch (Number(task.taskid)) {
            case 1:
                // The latest delOrderDate from delOrderA to delOrderE.
                var lastDelOrderDate = await this.getLatestDelOrderDate();
                if (lastDelOrderDate !== null) {
                    return new Date(lastDelOrderDate[0].toISODate());
                }
                return null;
            case 2:
                // Same date as DelOrderF
                var dueDateDelOrderF = delOrderDates[5].delOrderFDate;
                if (dueDateDelOrderF == null || dueDateDelOrderF == "") {
                    return null;
                } 
                dueDateDelOrderF = new Date(dueDateDelOrderF.toISODate());
                return dueDateDelOrderF;
            case 3:
                // Today's date (The date when the calibration is started).
                return new Date(); 
            case 4: 
            case 8:
                // The latest delOrderDate from delOrderA to delOrderE minus 10 days.
                var date = await this.getLatestDelOrderDateMinusTenDays();
                date = date.toISODate();
                date = new Date(date);
                return date;
            case 5:
                // If (latestDelOrderDate - 10 days) is on a Friday, the due date should be that date + 3 days. 
                // Else the due date should be that date + 1 day.
                var date = await this.getDueDateForBuildStructureInECOPlan();
                date = date.toISODate();
                date = new Date(date);
                return date;
            case 6:
                // If the date in case 5 is on a Thursday or Friday, this date should be that date + 4 days.
                // Else it should be that date + 2 days.
                var caseFiveDate = await this.getDueDateForBuildStructureInECOPlan();
                var result;
                if (caseFiveDate !== null) {
                    var weekday = caseFiveDate.toFormat('cccc');
                    if (weekday === 'Thursday' || weekday === 'Friday') {
                        result = caseFiveDate.plus({ days: 4 });
                    } else {
                        result = caseFiveDate.plus({ days: 2 });
                    }
                    return new Date(result.toISODate());
                }
                return null;
            case 7:
                // If the due date in case 4 is on a Friday, this date should be that date + 3 days. Else it should
                // be that date + 1 day.
                var latestDelOrderDate = await this.getLatestDelOrderDateMinusTenDays();
                if (latestDelOrderDate !== null) {
                    var weekday = latestDelOrderDate.toFormat('cccc');
                    var newDate;
                    if (weekday === 'Friday') {
                        newDate = new Date(latestDelOrderDate.plus({ days: 3 }).toISODate());
                    } else {
                        newDate = new Date(latestDelOrderDate.plus({ days: 1 }).toISODate());
                    }
                    return newDate;
                }
                return null;
            case 9:
                // The date for the task "Hold release meeting". Has no pre-calculated value. The date is 
                // decided by the user.
                break;
            case 10:
            case 14:
                // 7 days after "Hold release meeting".
                if (dateIsDefined) {
                    return task.date;
                } else {
                    if (releaseMeetingDate !== "") {
                        var newDate = new Date(DateTime.fromISO(releaseMeetingDate).plus({ days: 7 }).toISODate());
                        return newDate;
                    }
                    return null;
                }
            case 11:
                // "Hold release meeting" date - 14 days.
                if (dateIsDefined) {
                    return task.date;
                } else {
                    if (releaseMeetingDate !== "") {
                        var newDate = new Date(DateTime.fromISO(releaseMeetingDate).plus({ days: -14 }).toISODate());
                        return newDate;
                    }
                    return null;
                }
            case 12:
                // If case 11's date is on a Monday, this date is that date - 3 days. If it is on a Tuesday, this date
                // is that date - 4 days. In any other cases, this date is that date - 2 days.
                if (dateIsDefined){
                    return task.date;
                } else {
                    if (releaseMeetingDate !== "") {
                        var previousDate = DateTime.fromISO(releaseMeetingDate).plus({ days: -14 });
                        var newDate;
                        if (previousDate.toFormat('cccc') == 'Monday') {
                            newDate = new Date(previousDate.plus({ days: -3 }).toISODate());
                        } else if (previousDate.toFormat('cccc') == 'Tuesday') {
                            newDate = new Date(previousDate.plus({ days: -4 }).toISODate());
                        } else {
                            newDate = new Date(previousDate.plus({ days: -2 }).toISODate());
                        }
                        return newDate;
                    }
                    return null;
                }
            case 13:
                // "Hold release meeting" date + 14 days.
                if (dateIsDefined){
                    return task.date;
                } else {
                    if (releaseMeetingDate !== "") {
                        var newDate = new Date(DateTime.fromISO(releaseMeetingDate).plus({ days: 14 }).toISODate());
                        return newDate;
                    }
                    return null;
                }
            case 15:
                // "Hold release meeting" date + 35 days.
                if (dateIsDefined){
                    return task.date;
                } else {
                    if (releaseMeetingDate !== "") {
                        var newDate = new Date(DateTime.fromISO(releaseMeetingDate).plus({ days: 35 }).toISODate());
                        return newDate;
                    }
                    return null;
                }
            case 18:
                // DelOrderEDate - 10 days.
                var originalDelOrderEDate = delOrderDates[4].delOrderEDate;
                if (originalDelOrderEDate == null || originalDelOrderEDate == "") {
                    return null;
                } 
                var createDiffTableDateE = new Date(originalDelOrderEDate.plus({ days: -10 }).toISODate());
                return createDiffTableDateE;
            case 19:
                // DelOrderFDate - 10 days.
                var originalDelOrderFDate = delOrderDates[5].delOrderFDate;
                if (originalDelOrderFDate == null || originalDelOrderFDate == "") {
                    return null;
                } 
                var createDiffTableDateF = new Date(originalDelOrderFDate.plus({ days: -10 }).toISODate());
                return createDiffTableDateF;
            case 20:
                // DelOrderADate - 1 day.
                var originalDelOrderADate = delOrderDates[0].delOrderADate;
                if (originalDelOrderADate == null || originalDelOrderADate == "") {
                    return null;
                } 
                var dueDateDelOrderA = new Date(originalDelOrderADate.plus({ days: -1 }).toISODate());
                return dueDateDelOrderA;
            case 21:
               // DelOrderBDate - 1 day.
               var originalDelOrderBDate = delOrderDates[1].delOrderBDate;
                if (originalDelOrderBDate == null || originalDelOrderBDate == "") {
                    return null;
                } 
                var dueDateDelOrderB = new Date(originalDelOrderBDate.plus({ days: -1 }).toISODate());
                return dueDateDelOrderB;
            case 22:
                // DelOrderCDate - 1 day.
                var originalDelOrderCDate = delOrderDates[2].delOrderCDate;
                if (originalDelOrderCDate == null || originalDelOrderCDate == "") {
                    return null;
                } 
                var dueDateDelOrderC = new Date(originalDelOrderCDate.plus({ days: -1 }).toISODate());
                return dueDateDelOrderC;
            case 23:
                // DelOrderDDate - 1 day.
                var originalDelOrderDDate = delOrderDates[3].delOrderDDate;
                if (originalDelOrderDDate == null || originalDelOrderDDate == "") {
                    return null;
                } 
                var dueDateDelOrderD = new Date(originalDelOrderDDate.plus({ days: -1 }).toISODate());
                return dueDateDelOrderD;
            case 24:
                // DelOrderEDate - 8 days.
                var originalDelOrderEDate = delOrderDates[4].delOrderEDate;
                if (originalDelOrderEDate == null || originalDelOrderEDate == "") {
                    return null;
                } 
                var dueDateDelOrderE = new Date(originalDelOrderEDate.plus({ days: -8 }).toISODate());
                return dueDateDelOrderE;
            case 25:
                // DelOrderEDate - 1 day.
                var originalDelOrderEDate = delOrderDates[4].delOrderEDate;
                if (originalDelOrderEDate == null || originalDelOrderEDate == "") {
                  return null;
                }
            case 26:
                // DelOrderEDate - 8 days.
                var originalDelOrderEDate = delOrderDates[4].delOrderEDate;
                if (originalDelOrderEDate == null || originalDelOrderEDate == "") {
                    return null;
                } 
                var dueDateDelOrderE = new Date(originalDelOrderEDate.plus({ days: -8 }).toISODate());
                return dueDateDelOrderE;
            case 27:
                // DelOrderEDate - 1 day.
                var originalDelOrderEDate = delOrderDates[4].delOrderEDate;
                if (originalDelOrderEDate == null || originalDelOrderEDate == "") {
                    return null;
                } 
                var dueDateDelOrderE = new Date(originalDelOrderEDate.plus({ days: -1 }).toISODate());
                return dueDateDelOrderE;
            case 28:
            case 29:
            case 30:
            case 31:
                // DelOrderEDate.
                return this.getDueDateDelOrderE();
            case 32:
                // DelOrderFDate - 8 days.
                var originalDelOrderFDate = delOrderDates[5].delOrderFDate;
                if (originalDelOrderFDate == null || originalDelOrderFDate == "") {
                    return null;
                } 
                var dueDateDelOrderF = new Date(originalDelOrderFDate.plus({ days: -8 }).toISODate());
                return dueDateDelOrderF;
            case 33:
                // DelOrderFDate - 1 day.
                var originalDelOrderFDate = delOrderDates[5].delOrderFDate;
                if (originalDelOrderFDate == null || originalDelOrderFDate == "") {
                    return null;
                } 
                var dueDateDelOrderF = new Date(originalDelOrderFDate.plus({ days: -1 }).toISODate());
                return dueDateDelOrderF;
            case 34:
                // DelOrderFDate.
                var dueDateDelOrderF = delOrderDates[5].delOrderFDate;
                if (dueDateDelOrderF == null || dueDateDelOrderF == "") {
                    return null;
                } 
                dueDateDelOrderF = new Date(dueDateDelOrderF.toISODate());
                return dueDateDelOrderF;
            case 35:
                // "Hold release meeting" date - 14 days.
                if (task.date !== null && task.date !== undefined && task.date !== ""){
                    return task.date;
                } else {
                    if (releaseMeetingDate !== "") {
                        var newDate = new Date(DateTime.fromISO(releaseMeetingDate).plus({ days: -14 }).toISODate());
                        return newDate;
                    }
                    return null;
                }
            case 36:
                // "Hold release meeting" date - 14 days.
                if (task.date !== null && task.date !== undefined && task.date !== ""){
                    return task.date;
                } else {
                    if (releaseMeetingDate !== "") {
                        var newDate = new Date(DateTime.fromISO(releaseMeetingDate).plus({ days: -14 }).toISODate());
                        return newDate;
                    }
                    return null;
                }
            }
        },
    
    /**
     * Decides whether the task's date needs to be collected from getTaskDate or not. Depends on what
     * logic the dates are decided from.
     * 
     * @param {Object} task The task to control the date of.
     * @param {Date} releaseMeetingDate The release meeting date.
     */
    setTaskDate: async function (task, releaseMeetingDate) {
        var taskId = Number(task.taskid);
        // taskId 9 = ReleaseMeetingDate.
        if (task.date == "" || taskId == 9) { 
            var newDate = await this.getTaskDate(task, releaseMeetingDate);
            if (newDate !== undefined && newDate !== "") {
                task.date = newDate;
                return task.date;
            }
        } else {
            var isDate = task.date instanceof Date;
            if (!isDate) {
                task.date = await this.getTaskDate(task, releaseMeetingDate);
                return task.date;
            }
        }
        return null;
    },

    /**
     * When the releaseMeetingDate is changed, this method updates all the dates for the tasks that depends 
     * on the releaseMeetingDate date.
     */
    refreshDependentTaskDates: async function(tasks, releaseMeetingDate) {
        var taskIds = [10, 11, 12, 13, 14, 15, 35, 36];
        taskIds.forEach(taskId => {
            var task = tasks.find(element => Number(element.taskid) == taskId);
            task.date = "";
            this.releaseMeetingDate = releaseMeetingDate
            this.setTaskDate(task, releaseMeetingDate);
        });
        return tasks;
    }
}

export default TaskDueDates;