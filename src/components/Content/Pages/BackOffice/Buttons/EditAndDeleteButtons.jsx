import { Box, Button } from "@material-ui/core";

/**
 * Component for the "Edit" and "Delete" buttons for an item's detail view.
 * 
 * @param {*} props { setEditMode, handleOpenConfirmationDialog, type, editMode }
 * setEditMode - Function that sets edit mode to true.
 * handleOpenConfirmationDialog - Handles the opening of the confirmation dialog.
 * type - Type of the item to edit or delete.
 * editMode - Boolean value telling if editmode is on or off.
 */
export default function EditAndDeleteButtons({ setEditMode, handleOpenConfirmationDialog, type, editMode }) {
    /**
     * Shows the "Edit {type}" and "Delete {type}" buttons if editMode is false.
     */
    return <>
    { editMode === false ?
        <Box mt={2} sx={{ marginLeft: 10, marginRight:20,  display: "flex", 
        justifyContent: "space-between" }}>
            <Button style={{backgroundColor: "#3f51b5", color: "white"}}
            type="submit" variant="contained" name={"edit"}
            onClick={() => { setEditMode(true); }}>
                Edit {type}
            </Button>
            <Button style={{backgroundColor: "#F50303", color: "white"}}
            type="submit" variant="contained" name={"delete"}
            onClick={() => { handleOpenConfirmationDialog() }}>
                Delete {type}
            </Button>
        </Box>
    : null}   
    </>
}