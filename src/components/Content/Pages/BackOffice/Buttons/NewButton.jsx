import { Button, Paper } from '@material-ui/core';
import { listAndDetailStyles } from '../Helpers/StyleHelpers';

/**
 * Component for a new button that is visible when viewing the list of projects/tasks/groups.
 *
 * @param {*} props { handleClickOpen, type }
 * handleClickOpen - Function that handles the opening of the "new" popup window.
 * type - Project, group or task.
 */
export default function NewButton({ handleClickOpen, type }) {
    const classes = listAndDetailStyles();
  
  /**
   * Shows a "New" button.
   */
  return <>
    <Paper elevation={2} className={classes.paper}>
      <Button style={{ backgroundColor: "#3f51b5", color: "white", marginLeft: "15px"}}
      type="submit" variant="contained" name="create" 
      onClick={() => { handleClickOpen() }}>
        New {type}
      </Button>
    </Paper>
  </>
}
