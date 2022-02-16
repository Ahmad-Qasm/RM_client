import { useEffect, useRef, useReducer, useState } from 'react'
import { Box, makeStyles } from '@material-ui/core'

import * as Consts from '../../model/helpers/form/FieldConstants'
import { validate, formIsValid, VALID, EMPTY } from '../../model/helpers/form/Validator';
import { FieldTemplate } from '../../model/helpers/form/FieldTemplate';
import DelOrderRows from './DelOrderRows';
import NonDelOrderRows from './NonDelOrderRows';

const useStyles = makeStyles({
    inputFields: {

        "& .MuiBox-root": {
            // Style the boxes enclosing the inputfields and their title
            width: "100%",
            "& .MuiTypography-root": {
                // Style the inputfield titles
                fontSize: 14
            },
            "& .MuiTextField-root": {
                // Style the inputfields
                width: "100%",
            },
            "& .MuiAutocomplete-root": {
                // Style the autocomplete-fields
                width: "100%"
            },
        }
    }
});

/* Handles requested changes to the field value state */
function valueReducer(state, action) {
    switch (action.type) {
        case "UPDATE_FIELD": {
            const newValue = action.payload.newValue;
            const field = action.payload.field;
            const newState = { ...state, [field]: newValue }
            return newState;
        }
        case "UPDATE_PASSEDDATA": {
            const serializedEngines = JSON.stringify(action.payload.engines);
            const newData = { ...action.payload, [Consts.ENGINES]: serializedEngines };
            return newData;
        }
        default: {
            throw new Error("Recieved unknown action.type in valueReducer");
        }
    }
}

/* Handles requested changes to the validation state */
function validationReducer(state, action) {
    switch (action.type) {
        case "SET_VALIDATION_STATUS": {
            const field = action.payload.field;
            const validStatus = action.payload.validStatus;
            const newState = { ...state, [field]: validStatus }
            return newState;
        }
        default: {
            throw new Error("Recieved unknown action.type in validationReducer");
        }
    }
}

/* Like useEffect but does not run on first render.
   Used to prevent validation before user has submitted */
const useDidMountEffect = (func, deps) => {
    const didMount = useRef(false);
    useEffect(() => {
        if (didMount.current) func();
        else didMount.current = true;
    }, deps);
}

/**
 * Input fields with validation-functionality for creation and presentation of orders.
 * 
 * @prop {Boolean} readOnly - should the fields be read only?
 * @prop {Object} passedData - an object with key-value pairs where (field identifier)--maps to-->(field value)
 * @prop {Boolean} validateTrigger - when changed, triggers the function validateFields
 * @prop {Boolean} clearTrigger - when changed, triggers the function clearValidationMsgs
 * @prop {function(event)} callIfFormIsValid - called if the form is valid after a validate-form operation 
 */
export default function InputFields({ readOnly, passedFieldValues,
    callIfFormIsValid, validateTrigger, clearTrigger, orderState }) {
    const classes = useStyles();
    const [fieldValues, updateField] = useReducer(valueReducer, FieldTemplate);
    const [validationState, updateValidationState] =
        useReducer(validationReducer, FieldTemplate);
    const [validationDone, setValidationDone] = useState(false);

    /**
     * Validates values in fieldValues using the validate-function and
     * makes sure that atleast one delOrderDate field is picked
     */
    function validateFields() {
        //keep track of unfilled delOrderDate fields
        let unfilledDelOrders = 0;

        for (let field in fieldValues) {
            const value = fieldValues[field];
            let validStatus;

            //Set delOrderDate fields to valid if they are empty
            if (field.match('Date') && value === EMPTY) {
                unfilledDelOrders++;
                validStatus = VALID;
            } else if (field.match('project_responsible')) {
                validStatus = VALID;
            } else {
                validStatus = validate(field, value);
            }
            updateValidationState({
                type: "SET_VALIDATION_STATUS", payload: {
                    field: field,
                    validStatus: validStatus
                }
            });
        }

        const numberOfDelOrders = 6; //A to F is 6 del orders
        //if every delOrderDate is empty set DELORDER_A_DATE to invalid
        if (unfilledDelOrders === numberOfDelOrders) {
            updateValidationState({
                type: "SET_VALIDATION_STATUS", payload: {
                    field: Consts.DELORDER_A_DATE,
                    validStatus: "Fill in the field for atleast one delOrder"
                }
            });
        }
    }

    /**
     * Clear all the validation error messages from the input fields.
     */
    function clearValidationMsgs() {
        const validationStateArrayForm = Object.entries(validationState)
        for (const [field] of validationStateArrayForm)
            updateValidationState({
                type: "SET_VALIDATION_STATUS", payload: {
                    field: field,
                    validStatus: VALID
                }
            });
    }

    //Update fields when passed data is changed
    useEffect(() => {
        if (passedFieldValues != null)
            updateField({ type: "UPDATE_PASSEDDATA", payload: passedFieldValues })
    }, [passedFieldValues]);

    //Called when user submits form
    useDidMountEffect(() => {
        validateFields(); //Updates <validationState>
        setValidationDone(!validationDone);
    }, [validateTrigger]);

    //Runs when <validationDone> has been updated (by previous useEffect[validateTrigger])
    useDidMountEffect(() => {
        if (formIsValid(validationState)) {
            callIfFormIsValid(validateTrigger);
        }
    }, [validationDone]);

    useDidMountEffect(() => {
        clearValidationMsgs();
    }, [clearTrigger]);

    return (
        //Display a vertically and horizontally centered column of rows containing input fields
        <Box display="flex" flexDirection="column" alignItems="center"
            justifyContent="center" height="100%" className={classes.inputFields}>
            <NonDelOrderRows readOnly={readOnly}
                updateField={updateField}
                validationState={validationState}
                fieldValues={fieldValues}
                updateValidationState={updateValidationState}
                orderState={orderState} />

            <DelOrderRows readOnly={readOnly}
                updateField={updateField}
                validationState={validationState}
                fieldValues={fieldValues} />
        </Box>
    )
}
