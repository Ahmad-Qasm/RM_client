import { Button, DialogContent, DialogActions, Dialog, DialogTitle, DialogContentText } from "@material-ui/core";

/**
 * Component for the dialog that confirms deletion of an item.
 * 
 * @param {*} props {openConfirmationDialog, handleCloseConfirmationDialog,
 * type, deleteFunction, activeItemName, setHasBeenSaved, handleCloseDetailInfo}
 * openConfirmationDialog - Boolean value telling whether the confirmation dialog should be open.
 * handleCloseConfirmationDialog - Function that closes the confirmation dialog.
 * type - The type of the item that will be deleted, e.g. group, task or project.
 * deleteFunction - Function that handles the deletion process of the item.
 * activeItemName - Name of the clicked item to be deleted.
 * setHasBeenSaved - Function that sets hasbeensaved to true.
 * handleCloseDetailInfo - Function that closes the detail view of the item to delete.
 */
export default function ConfirmationDialog({openConfirmationDialog, handleCloseConfirmationDialog,
    type, deleteFunction, activeItemName, setHasBeenSaved, handleCloseDetailInfo}) {

    /**
     * Returns a confirmation dialog.
     */
    return <>
        <Dialog open={openConfirmationDialog} onClose={handleCloseConfirmationDialog}>
            <DialogTitle>{"Confirm deletion"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this {type}?
                    </DialogContentText>
                </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseConfirmationDialog} color="primary" autoFocus>
                    No
                </Button>
                <Button form="confirmDelete-form" 
                onClick={() => deleteFunction(handleCloseConfirmationDialog, activeItemName, 
                    setHasBeenSaved, handleCloseDetailInfo)} 
                color="primary" type="submit" name="delete">
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    </>
}