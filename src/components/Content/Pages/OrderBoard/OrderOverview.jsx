import { useState, useEffect } from "react"
import { makeStyles, Grid, Typography, Select, MenuItem, InputLabel, FormControl, Link } from "@material-ui/core"

const useStyles = makeStyles({
    "& .MuiGrid": {
        width: "100%"
    },

    formControl: {
        minWidth: 120,
    }
});

/**
 * Component which displays an overview of order information
 * without allowing user to perform any action (e.g. edit, approve)
 * @param {*} orderDetails - Order information to be displayed for specific order 
 * @returns 
 */
export default function OrderOverview({ orderDetails }) {
    const classes = useStyles();
    const [engines, setEngines] = useState([])

    /**
     * Used for loading a dropdown list with
     * the name of chosen engines from the selected order
     */
    function loadEngineDropdown() {
        let engineList = []

        for (let i = 0; i < orderDetails.engines.length; i++) {
            engineList.push(orderDetails.engines[i].name)
        }

        setEngines(engineList)
    }

    useEffect(() => {
        loadEngineDropdown()
    }, [orderDetails.engines])

    return (
        <>
            {/* Grid displaying the Engine details for the Order. 
                The Engine details are fetched from Comptrans: Project, Bsw version, Engine attributed 
                TODO: Find a way to decrease the amount of code rows by means
                      of compressing the grid */}
            <Grid container direction="row" alignItems="flex-start" spacing={2}>
                <Grid item xs="12" className={classes.infoGrid}>
                    <Typography style={{ fontWeight: 600 }}>Engine Details</Typography>
                </Grid>
                <Grid item xs="5">
                    <Typography>Project:</Typography>
                </Grid>
                <Grid item xs="7">
                    <Typography>{orderDetails.project}</Typography>
                </Grid>
                <Grid item xs="5">
                    <Typography>BSW Version:</Typography>
                </Grid>
                <Grid item xs="7">
                    <Typography>{orderDetails.bswVersion}</Typography>
                </Grid>
                <Grid item xs="5">
                    <Typography>Engines:</Typography>
                </Grid>
                <Grid item xs="7">
                    <FormControl variant="filled" className={classes.formControl}>
                        <InputLabel id="engine-dropdown">Engines</InputLabel>
                        <Select
                            labelId="engine-dropdown"
                        >
                            {/* Loops through engines and adds every entry as menu item */}
                            {engines.map((engine) => <MenuItem>{engine}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>

            </Grid>
            <hr />
            {/* Grid displaying Order information details such as:
                SOP, Release type, Status, Release week, Meco, Account number, Files on server week 
                TODO: Find a way to decrease the amount of code rows by means
                      of compressing the grid */}
            <Grid container direction="row" alignItems="flex-start" spacing={2}>
                <Grid item xs="5">
                    <Typography>SOP/SOCOP:</Typography>
                </Grid>
                <Grid item xs="7">
                    <Typography>{orderDetails.sopSocop}</Typography>
                </Grid>
                <Grid item xs="5">
                    <Typography>Type Of Release:</Typography>
                </Grid>
                <Grid item xs="7">
                    <Typography>{orderDetails.typeOfRelease}</Typography>
                </Grid>
                <Grid item xs="5">
                    <Typography>Status:</Typography>
                </Grid>
                <Grid item xs="7">
                    <Typography>{orderDetails.status}</Typography>
                </Grid>
                <Grid item xs="5">
                    <Typography>Week Of Release:</Typography>
                </Grid>
                <Grid item xs="7">
                    <Typography>{orderDetails.relMeetingWeek}</Typography>
                </Grid>
                <Grid item xs="5">
                    <Typography>Files On Server Week:</Typography>
                </Grid>
                <Grid item xs="7">
                    <Typography>{orderDetails.filesOnServerWeek}</Typography>
                </Grid>
                <Grid item xs="5">
                    <Typography>Project Meco:</Typography>
                </Grid>
                <Grid item xs="7">
                    <Typography>{orderDetails.projectMeco}</Typography>
                </Grid>
                <Grid item xs="5">
                    <Typography>Project Account Nr:</Typography>
                </Grid>
                <Grid item xs="7">
                    <Typography>{orderDetails.projectAccountNumber}</Typography>
                </Grid>
            </Grid>
            <hr />

            {/* Grid displaying Delorders with dates and comments 
                TODO: Find a way to decrease the amount of code rows by means
                      of compressing the grid */}
            <Grid container direction="row" alignItems="flex-start" spacing={2}>
                <Grid item xs="3" className={classes.infoGrid}>
                    <Typography style={{ fontWeight: 600 }}>Delorders</Typography>
                </Grid>
                <Grid item xs="2" className={classes.infoGrid}>
                    <Typography style={{ fontWeight: 600 }}>Week</Typography>
                </Grid>
                <Grid item xs="7" className={classes.infoGrid}>
                    <Typography style={{ fontWeight: 600 }}>Comment</Typography>
                </Grid>
                <Grid item xs="3">
                    <Typography>Delorder A:</Typography>
                </Grid>
                <Grid item xs="2">
                    <Typography>{orderDetails.delOrderADate}</Typography>
                </Grid>
                <Grid item xs="7">
                    <Typography>{orderDetails.delOrderAComment}</Typography>
                </Grid>
                <Grid item xs="3">
                    <Typography>Delorder B:</Typography>
                </Grid>
                <Grid item xs="2">
                    <Typography>{orderDetails.delOrderBDate}</Typography>
                </Grid>
                <Grid item xs="7">
                    <Typography>{orderDetails.delOrderBComment}</Typography>
                </Grid>
                <Grid item xs="3">
                    <Typography>Delorder C:</Typography>
                </Grid>
                <Grid item xs="2">
                    <Typography>{orderDetails.delOrderCDate}</Typography>
                </Grid>
                <Grid item xs="7">
                    <Typography>{orderDetails.delOrderCComment}</Typography>
                </Grid>
                <Grid item xs="3">
                    <Typography>Delorder D:</Typography>
                </Grid>
                <Grid item xs="2">
                    <Typography>{orderDetails.delOrderDDate}</Typography>
                </Grid>
                <Grid item xs="7">
                    <Typography>{orderDetails.delOrderDComment}</Typography>
                </Grid>
                <Grid item xs="3">
                    <Typography>Delorder E:</Typography>
                </Grid>
                <Grid item xs="2">
                    <Typography>{orderDetails.delOrderEDate}</Typography>
                </Grid>
                <Grid item xs="7">
                    <Typography>{orderDetails.delOrderEComment}</Typography>
                </Grid>
                <Grid item xs="3">
                    <Typography>Delorder F:</Typography>
                </Grid>
                <Grid item xs="2">
                    <Typography>{orderDetails.delOrderFDate}</Typography>
                </Grid>
                <Grid item xs="7">
                    <Typography>{orderDetails.delOrderFComment}</Typography>
                </Grid>
            </Grid>
            {orderDetails.state === 2 ? <>
                <hr />
                <Grid container direction="row" alignItems="flex-start" spacing={2}>
                    <Grid item xs="12" className={classes.infoGrid}>
                        <Typography style={{ fontWeight: 600 }}>Jira Story</Typography>
                    </Grid>
                    <Grid item xs="5">
                        <Link rel="noreferrer" target="_blank" href={orderDetails.storyLink}>
                            {orderDetails.storyLink}
                        </Link>
                    </Grid>
                </Grid>
            </> : null}
        </>
    );
}