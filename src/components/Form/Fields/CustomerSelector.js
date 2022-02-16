import { useState } from 'react';
import { Typography, Box, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { CUSTOMER } from '../../../model/helpers/form/FieldConstants';
import { FieldLabels } from '../../../model/helpers/form/FieldTemplate';
import { PlaceHolders } from '../../../model/helpers/form/FieldTemplate';

const customers = ["TB-cal", "SE-cal", "Otto-cal", "GSC-cal"];

/**
 * Autocomplete field for selecting an order's customer.
 * 
 * @prop {Function(Object)} updateField - dispatch an update field action
 * @prop {Object} fieldValues - key-value pair: (field identifier)-->(field value)
 * @prop {Boolean} readOnly - should field value be read only
 */
export default function CustomerSelector({ updateField, fieldValues, readOnly }) {
    const [selectedValue, setSelectedValue] = useState(null);
    const [open, setOpen] = useState(false);

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
                { field: CUSTOMER, newValue: newValue }
        });
    }

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

    return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center"
        height="100%">
            <Typography>{FieldLabels[CUSTOMER]}</Typography>
            <Autocomplete

                /* Selected value */
                value={selectedValue}
                onChange={changeSelected}

                /* TextField value */
                inputValue={fieldValues[CUSTOMER]}
                onInputChange={changeValue}
                
                /* Load list-options  */
                options={customers}
                noOptionsText={"No matching customer"}

                /* Open popper only when not in read only mode */
                open={open}
                onOpen={() => { return readOnly ? null : setOpen(true) }}
                onClose={() => { setOpen(false) }}

                size="small" 
                /* Use TextField as input-component */
                renderInput={(params) =>
                    <TextField
                        {...params}
                        placeholder={PlaceHolders[CUSTOMER]}
                        variant="outlined"
                        name={CUSTOMER}
                    />
                }
            />
        </Box>
    );
}
