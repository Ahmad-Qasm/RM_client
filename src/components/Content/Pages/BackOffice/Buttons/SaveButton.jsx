import { Button, Grid } from '@material-ui/core';

/**
 * Component for a save button that is visible when editing a project/task/group.
 *
 * @param {*} props { validateFields, editMode, saveFunction, validateFunction, fieldValues, 
 * componentDetails, setHasBeenSaved, closeDetailInfo }
 * validateFields - Function that runs the validation for all the inputfields.
 * editMode - Boolean value telling whether editing mode is on or off.
 * saveFunction - The function that saves the changes.
 * validateFunction - The function that validates the input for task and project before saving.
 * fieldValues - Values to save.
 * componentDetails - Used to get the ID of the component to save.
 * setHasBeenSaved - Boolean value, telling the application whether a component has just been saved.
 * closeDetailInfo - Boolean value, telling whether the detail view should be open or not.
 */
export default function SaveButton({ validateFields=null, editMode, saveFunction, fieldValues, 
    componentDetails, setHasBeenSaved, closeDetailInfo }) {

    /**
     * Runs the save function with or without the validation-parameter, depending on the component.
     * This because the component "group" does not have a validation parameter.
     */ 
    async function save() {
        if (validateFields === null) {
            return await saveFunction(fieldValues, componentDetails, setHasBeenSaved, closeDetailInfo);
        } else {
            return await saveFunction(validateFields, fieldValues, componentDetails, setHasBeenSaved, 
            closeDetailInfo);
        }
    }

    /**
     * Shows a "Save" button if editMode is true.
     */
    return <>
        {editMode ? (
            <>
            <Grid container alignItems="center" justifyContent="center">
            <Button style={{ backgroundColor: "#3f51b5",
                marginTop: "1em", color: "white"}}
                variant="contained" name="confirm"
                type="submit"
                onClick={save}
            >Save</Button>
            </Grid>
            </>
        ) : null }
    </>
}
