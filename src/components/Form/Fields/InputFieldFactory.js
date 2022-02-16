import { TextField, Typography, Box, Tooltip, makeStyles } from '@material-ui/core';
import { PlaceHolders, FieldLabels } from '../../../model/helpers/form/FieldTemplate'
import { VALID } from '../../../model/helpers/form/Validator';

const useStyles = makeStyles(() => ({
    toolTip: { backgroundColor: '#CBC5C4', color: "white" },
}));

/**
 * Every inputfield that does not need special functionality such as autocompletion is "created"
 * through this component.
 * 
 * @prop {int} fieldId - the field to be created's id
 * @prop {Function} updateField - update the value of a field
 * @prop {Object} validationState - the state of validation for each field
 * @prop {Object} fieldValues - the field values
 * @prop {Boolean} readOnly - should the rows be read only?  
 */
export function InputFieldFactory({ fieldId, updateField, validationState, fieldValues, readOnly, hoverText }) {

    const classes = useStyles();

    function updateFieldValue(e) {
        updateField({
            type: "UPDATE_FIELD",
            payload: {
                field: e.target.name,
                newValue: e.target.value
            }
        });
    }

    return (
        //Display a vertically and horizontally centered column of the label and textfield for
        //a inputfield
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center"
            height="100%">
            <Typography>{FieldLabels[fieldId]}</Typography>
            <Tooltip title={hoverText} placement="bottom" disableHoverListener 
                     classes={{tooltip: classes.toolTip}}>
                <TextField
                    size="small"
                    inputProps={{
                        readOnly: readOnly,
                    }}
                    variant="outlined"
                    name={fieldId}
                    value={fieldValues[fieldId]}
                    placeholder={PlaceHolders[fieldId]}
                    onChange={updateFieldValue}
                    //Indicate error if field value is not valid
                    error={validationState[fieldId] !== VALID}
                    //Display helper text if field value is not valid
                    helperText={validationState[fieldId] !== VALID ? validationState[fieldId] : null}
                />
            </Tooltip>
        </Box>
    )
}