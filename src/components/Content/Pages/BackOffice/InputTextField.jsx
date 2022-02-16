import CommonHelpers from "./Helpers/CommonHelpers";
import { inputFieldStyles } from "./Helpers/StyleHelpers";
import { TextField, Typography } from '@material-ui/core';

/**
* Generates a textfield and labeltext for a group, project or task,
* with an onchange function if editMode is true, else with an readonly
* attribute.
*/
export default function InputTextField({  withErrorMessages=false, isReadOnly=false, updateField, name, fieldValue, 
    validationState, fieldLabel, maxrows=1 }) {
    const classes = inputFieldStyles();

    /**
     * Return a validateable textfield with a label when there is validation for the field, else just
     * a textfield with a label.
     */
    return <>
        <Typography className={classes.paperHeader}>{fieldLabel}</Typography>
        {withErrorMessages ? 
            <TextField className={classes.paper}
                size="small" variant="outlined"
                name={name}
                value={fieldValue}
                inputProps={{ readOnly: isReadOnly }}
                onChange={(event) => CommonHelpers.changeValue(updateField, name, event.target.value)}
                //Indicate error if field value is not valid
                error={validationState !== "" && validationState !== true}
                //Display helper text if field value is not valid
                helperText={validationState !== true ? validationState : null}
                multiline
                maxrows={maxrows}
            /> 
        : <>
            <TextField className={classes.paper}
                size="small" variant="outlined"
                name={name}
                value={fieldValue}
                inputProps={{ readOnly: isReadOnly }}
                onChange={(event) => CommonHelpers.changeValue(updateField, name, event.target.value)}
                multiline
                maxrows={maxrows} 
            />
        </>}
    </>
}
