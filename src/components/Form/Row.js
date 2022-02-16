import { Grid } from "@material-ui/core";

/**
 * Row of two components
 * 
 * @prop {Component} component1 - the left component in this row
 * @prop {Component} component2 - the right component in this row
 */
export default function Row({ component1, component2 }) {

    return (
        <Grid container direction="row" justifyContent="center" spacing={1} alignItems="center"
            style={{height:"100%", width:"100%"}}>
            {/* First column of row */}
            <Grid item xs={6}>
                {component1}
            </Grid>

            {/* Second column of row */}
            <Grid item xs={6}>
                {component2}
            </Grid>

        </Grid>
    )
}
