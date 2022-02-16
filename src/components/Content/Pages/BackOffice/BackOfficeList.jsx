import { BackOfficeStyles } from "./Helpers/StyleHelpers";
import { Box, Grid, Paper, Typography, Card, CardContent, CardActionArea } 
    from "@material-ui/core";

/**
 * Component of the list of categories that can be handled in BackOffice.
 * 
 * @param {*} props { leftBoardWidth, listItemProjects, listItemGroups, 
 * listItemTasks, setBoardWidthsToStandard, openList }
 * leftBoardWidth - Width of the left part of the board.
 * listItemProjects - Constant for "Projects".
 * listItemGroups - Constant for "Groups".
 * listItemTasks - Constant for "Tasks".
 * setBoardWidthsToStandard - Function that resets width of all boards.
 * openList - Function passed from BackOffice.
 */
export default function BackOfficeList({leftBoardWidth, listItemProjects, listItemGroups, 
    listItemTasks, setBoardWidthsToStandard, openList}) {
    const classes = BackOfficeStyles();
    
    /**
    * Opens List of existing projects, groups or tasks when their component is clicked.
    * 
    * @param {String} itemName Name of the component that was clicked.
    */
    function componentClicked(itemName) {
        switch (itemName) {
            case listItemProjects: {
                openList(listItemProjects);
                break;
            }
            case listItemGroups: {
                openList(listItemGroups);
                break;
            }
            case listItemTasks: {
                openList(listItemTasks);
                break;
            }
            default:
                openList("");
                break;
        }
    }

    /**
     * Shows componentlist on the BackOffice page, with the categories that BackOffice can handle.
     */
    return <Box gridColumn={leftBoardWidth}>
        <Grid className={classes.paperHeader}>
            <Paper elevation={10}>
                <Card className={classes.categoryListCard} 
                    onClick={() => { componentClicked(listItemProjects) }}>
                    <CardActionArea>
                        <CardContent>
                            <Typography className={classes.categoryListText}>
                                Projects</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Paper>
            <Paper elevation={10}>
                <Card className={classes.categoryListCard} 
                onClick={() => { componentClicked(listItemGroups) }}>
                    <CardActionArea>
                        <CardContent>
                            <Typography className={classes.categoryListText}>Groups</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Paper>
            <Paper elevation={10}>
                <Card className={classes.categoryListCard} 
                onClick={() => { componentClicked(listItemTasks) }}>
                    <CardActionArea>
                        <CardContent>
                            <Typography className={classes.categoryListText}>Tasks</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Paper>
        </Grid>
    </Box>
}