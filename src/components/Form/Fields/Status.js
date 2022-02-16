import { useState } from 'react'
import { Typography, TextField, Box } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'

import { STATUS } from '../../../model/helpers/form/FieldConstants'
import { FieldLabels, PlaceHolders } from '../../../model/helpers/form/FieldTemplate'
import { VALID } from '../../../model/helpers/form/Validator'

const statuses = ["R", "P", "PR", "S"];

/**
 * Status field used in the order-form
 * 
 * Uses Autocomplete from material-ui to allow for status-searching in a 
 * text field with a dropdown box showing matching alternatives
 * 
 * @prop {Function(Object)} updateField - dispatch an update field action
 * @prop {Object} validationState - key-value pair: 
 *                              (field identifier)-->(value is valid or error message)
 * @prop {Object} fieldValues - key-value pair:
 *                             (field identifier)-->(field value)
 * @prop {Boolean} readOnly - should field value be read only?
 * 
 */
export default function Status({ updateField, fieldValues, validationState,
    readOnly }) {
    const [selectedValue, setSelectedValue] = useState(null);
    const [open, setOpen] = useState(false);

    /**
     * Change the selected value. 
     * 
     * The selected value is required for Autocomplete to appropriately show the
     * matching values in the dropdown box.
     * @param {Event} event - (used for pattern matching only)
     * @param {String} newSelected - the newly selected value
     */
    function changeSelected(event, newSelected) {
        if (readOnly)
            return;

        setSelectedValue(newSelected);
    }

    /**
     * Change the textfield value
     * 
     * Is invoked everytime selectedValue changes or when the user writes in the textfield
     * @param {Event} event - (used for pattern matching only)
     * @param {String} newValue - the value to change for the TextField
     */
    function changeValue(event, newValue) {
        if (readOnly)
            return;

        updateField({
            type: "UPDATE_FIELD", payload:
                { field: STATUS, newValue: newValue }
        });
    }

    return (
        //Display a vertically and horizontally centered column of the label and autocomplete-field for
        //the Project.
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center"
        height="100%">
            <Typography>{FieldLabels[STATUS]}</Typography>
            <Autocomplete
                /* The clear button messes with validation */
                disableClearable

                /* Selected value */
                value={selectedValue}
                onChange={changeSelected}

                /* TextField value */
                inputValue={fieldValues[STATUS]}
                onInputChange={changeValue}

                /* Load list-options from projects  */
                options={statuses}
                noOptionsText={"No matching status"}

                /* Open popper only when not in read only mode */
                open={open}
                onOpen={() => { return readOnly ? null : setOpen(true) }}
                onClose={() => { setOpen(false) }}

                size="small" 
                /* Use TextField as input-component */
                renderInput={(params) =>
                    <TextField
                        {...params}
                        variant="outlined"
                        placeholder={PlaceHolders[STATUS]}
                        name={STATUS}
                        //Indicate error if field value is not valid
                        error={validationState[STATUS] !== VALID}
                        //Display helper text if field value is not valid
                        helperText={validationState[STATUS] !== VALID ?
                            validationState[STATUS] : null}
                    />
                }
            />
        </Box>
    );
}