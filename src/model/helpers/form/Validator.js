/**
 * Handles the validation of /src/Components/Form/InputFields
 */
import * as Constants from './FieldConstants'
export const VALID = "";
export const EMPTY = "";

/**
 * @param {String} fieldIdentifier 
 * @param {String} fieldValue 
 * Validates a field
 * @return {String} if field value is valid: VALID, else: an error message
 */
export function validate(fieldIdentifier, fieldValue) {
    switch (fieldIdentifier) {
        case Constants.PROJECT: {
            return validateProject(fieldValue);
        }
        case Constants.SOP_SOCOP: {
            return validateSOPSOCOP(fieldValue);
        }
        case Constants.TYPE_OF_RELEASE: {
            return VALID; //Do not validate
        }
        case Constants.STATUS: {
            return validateStatus(fieldValue);
        }
        case Constants.BSW_VERSION: {
            return validateBSWVersion(fieldValue);
        }
        case Constants.REL_MEETING_WEEK: {
            return validateRelMeetingWeek(fieldValue);
        }
        case Constants.FILES_ON_SERVER_WEEK: {
            return validatewYYMM(fieldValue);
        }
        case Constants.PROJECT_MECO: {
            return validateMECO(fieldValue);
        }
        case Constants.PROJECT_ACCOUNT_NUMBER: {
            return validateProjAccNumber(fieldValue);
        }
        case "engines": {
            if (fieldValue === "[]") //if engines are empty          
                return "Please select atleast one engine";
            return VALID;
        }
        case Constants.ORIGINAL_ESTIMATE: {
            return validateOriginalEstimate(fieldValue);
        }
        case Constants.TASK: {
            return validateTask(fieldValue);
        }
        case Constants.PROJECT_RESPONSIBLE: {
            return validateProjectResponsible(fieldValue);
        }
        default: {
            if (fieldIdentifier.match(/Comment/)) //Do not validate delOrder comments
                return VALID;
            if (fieldIdentifier.match(/delOrder/))
                return validateDelOrderDate(fieldValue);

            //Return valid for fieldIdentifiers that do not need validation i.e
            //state, date_created, creator, id etc.
            return VALID;
        }
    }
}

/**
 * 
 * @param {Object} validationResults - An object with key-fieldValue pairs:
 *                                       (input fieldIdentifier)-->(validation status)
 * Checks if every field value in the validation results is valid.
 * @returns {Boolean} If every field value is valid: true, else: false
 */
export function formIsValid(validationResults) {
    for (let fieldIdentifier in validationResults) {
        if (validationResults[fieldIdentifier] === VALID)
            continue;
        else {
            return false;
        }
    }
    return true;
}

/** Validates if value is a combination of uppercase/lowercase characters, 
 *  underscores, hyphens and integers.  
 */
function validateProject(fieldValue) {
    // Any alphanumeric string is valid
    if (fieldValue.match(/^[0-9a-zA-Z_]+$/))
        return VALID;
    return "Please enter an alphanumeric name"
}

/** Validate if format is YYYYMM.X where YYYY is a year (2021 or later), 
 * MM the month and X is an integer
 */
function validateSOPSOCOP(fieldValue) {

    if (fieldValue.length !== 8)
        return "Value must be 8 characters"

    const YYYY = fieldValue.slice(0, 4);
    const MM = fieldValue.slice(4, 6);
    const separator = fieldValue[6];
    const X = fieldValue.slice(7);

    if (separator !== '.')
        return "Bad separator " + separator + " use dot: ."

    const year = parseInt(YYYY)
    //if year is not only numbers or less than 2021
    //TODO: Hämta dagens datum från någon tidskälla istället för hårdkodad regex uttryck
    if (!YYYY.match(/^[0-9]+$/) || year < 2021)
        return "Enter a year 2021 or later";

    if (!MM.match(/^0[1-9]|1[0-2]+$/))
        return "Enter a valid month";

    if (!X.match(/^[0-9]+$/))
        return "Last character must be a digit";

    return VALID;
}

/** Validates if field value is R, P, RP or S */
function validateStatus(fieldValue) {
    if (fieldValue === 'R' || fieldValue === 'P' || fieldValue === 'PR' ||
        fieldValue === 'S')
        return VALID;
    return "Choose a valid status: R, P, PR or S"
}

/** Validate if format is XX.XX.XX, XXX.XX.XX, XXXXX, XXXX or XX_XX.XX.XX where X is alphanumeric */
function validateBSWVersion(fieldValue) {
    /**Take out the dots from the text */
    const filteredField = fieldValue.split(".");

    switch (fieldValue.length) {
        case 4:
            for (let i = 0; i < fieldValue.length; i++) {
                if (!fieldValue[i].match(/^[0-9a-z]+$/))
                    return "Format: XXXX where X is number or character";
            }
            break;
        case 5:
            for (let i = 0; i < fieldValue.length; i++) {
                if (!fieldValue[i].match(/^[0-9a-z]+$/))
                    return "Format: XXXXX where X is number or character";
            }
            break;
        case 8:
            if (fieldValue[2] !== "." || fieldValue[5] !== ".")
                return "Use dot as separator i.e XX.XX.XX";

            for (let i = 0; i < filteredField.length; i++) {
                if (!filteredField[i].match(/^[0-9a-z]+$/))
                    return "Format: XX.XX.XX where X is number or character";
            }
            break;

        case 9:
            if (fieldValue[3] !== "." || fieldValue[6] !== ".")
                return "Use dot as separator i.e XXX.XX.XX";

            for (let i = 0; i < filteredField.length; i++) {
                if (!filteredField[i].match(/^[0-9a-z]+$/))
                    return "Format: XXX.XX.XX where X is number or character";
            }
            break;
        case 11:
            for (let i = 0; i < fieldValue.length; i++) {
                if (i === 2) {
                    if (!fieldValue[i].match(/^[_]+$/)) {
                        return "Format: XX_XX.XX.XX where X is number or character";
                    }
                } else if (i === 5 || i === 8) {
                    if (!fieldValue[i].match(/^[.]+$/)) {
                        return "Format: XX_XX.XX.XX where X is number or character";
                    }
                } else {
                    if (!fieldValue[i].match(/^[0-9a-z]+$/)) {
                        return "Format: XX_XX.XX.XX where X is number or character";
                    }
                }
            }
            break;
        default:
            let str = `Value has to be 4, 5, 8, 9 or 11 characters and follow one of these formats:
            1- XXXX \\
            2- XXXXX \\
            3- XX.XX.XX \\
            4- XXX.XX.XX \\
            5- XX_XX.XX.XX`;
            return str;     
    }
    return VALID;
}

/*Validate if format is wYYWW where w is a character 'w', YY are the last digits
 of the year and WW is the week. */
function validatewYYMM(fieldValue) {

    if (fieldValue.length !== 5)
        return "Value has to be 5 characters";

    const firstChar = fieldValue[0];
    const YY = fieldValue.slice(1, 3);
    const WW = fieldValue.slice(3, 5);

    if (firstChar !== 'w')
        return "Format: wYYWW";

    //TODO: Hämta dagens datum från någon tidskälla istället för hårdkodad regex uttryck
    if (!YY.match(/2[1-9]/))
        return "Pick year 21 or later";

    if (!WW.match(/0[1-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-3]/))
        return "Pick a valid week: 01-53";

    return VALID;
}

/**
* Optional field.
* Validate if format is empty or wYYWW where w is a character 'w', YY are the
* last digits of the year and WW is the week.
*/
function validateRelMeetingWeek(fieldValue) {
    if (fieldValue === EMPTY)
        return VALID;
    return validatewYYMM(fieldValue);
}

/** Validate if format is XXXXXX where X is and integers */
function validateMECO(fieldValue) {
    const convertedValue = fieldValue.toString();
    //toString is required because fieldValue gets
    //converted to a number-type in orderInfo for some reason :S

    if (convertedValue.length !== 6)
        return "Value must be 6 characters";

    if (!convertedValue.match(/^[0-9]+$/))
        return "Only numeric values allowed";

    return VALID;
}

/** Validate if format is XX-XXXXXX where X is an integer */
function validateProjAccNumber(fieldValue) {
    if (fieldValue.length !== 9)
        return "Value has to be 9 characters";

    const XX = fieldValue.slice(0, 2);
    const separator = fieldValue[2];
    const XXXXXX = fieldValue.slice(3, 9);

    if (separator !== '-')
        return "Invalid separator " + separator + " use: -";

    if (!XX.match(/^[0-9]+$/) || !XXXXXX.match(/^[0-9]+$/))
        return "Only numeric values allowed";

    return VALID;
}

function validateDelOrderDate(fieldValue) {
    return validatewYYMM(fieldValue);
}

/** 
 * Validates that field value only consists of numbers and the following characters: .Nn()+*-/ 
*/
function validateOriginalEstimate(fieldValue) {
    if (isNaN(fieldValue)) {
        let letters = fieldValue.split("");
        for (let i = 0; i < letters.length; i++) {
            var letter = letters[i];
            if (isNaN(letter)) {
                if (!letter.match(/^[Nn()*/+-.]+$/)) {
                    return "Your original estimate contains unallowed characters. " + 
                    "Only numbers and .Nn()+*-/ are allowed.";
                }
            }
        }
        return VALID;
    }
    return VALID;
}

/** 
 * Validates that field value is either alphanumeric, whitespace or any of the following 
 * characters: (),+\-."'
*/
function validateTask(fieldValue) {
    let letters = fieldValue.split("");
    for (let i = 0; i < letters.length; i++) {
        var letter = letters[i];
        if (!letter.match(/^[åöä0-9a-zA-Z(),+\-"'. ]+$/)) {
            return "Please remove unallowed characters from task name";
        }
    }
    return VALID;
}

/**
 * Validates that field value is alphanumeric and consists of 6 letters.
 */
function validateProjectResponsible(fieldValue) {
    if (fieldValue.match(/^[0-9a-zA-Z_]+$/) && fieldValue.length === 6) {
        return VALID;
    }
    return "Field must consist of 6 alphanumeric characters.";
}