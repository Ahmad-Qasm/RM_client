import { useContext, useState } from 'react'
import { Grid, Button } from '@material-ui/core'
import { UserContext } from '../../../../model/state/UserContext';
import { BlueSubmitButton } from '../../../../model/helpers/button/FormButton';
import ReleaseTaskPopUp from './ReleaseTaskPopUp';

/**
 * Shows the appropriate buttons when an approved order is being displayed in
 * OrderInfo.
 * Displays buttons [Unapprove] [Start Release Process] for release managers
 * and nothing for regular users. If the admin clicks "Start Release Process",
 * a new popup with tasks to choose and set date for is displayed.
 */
export default function ApprovedButtonField({orderId, startReleaseProcess, orderDetails,
    setStoryLink }) {
    const { user } = useContext(UserContext)
    const [openReleaseTaskPopUp, setOpenReleaseTaskPopUp] = useState(false);

    const handleClickOpenReleaseTaskPopUp = (event) => {
        event.preventDefault();
        setOpenReleaseTaskPopUp(true);
    };

    const handleCloseReleaseTaskPopUp = () => {
        setOpenReleaseTaskPopUp(false);
    };

    return (
        //Display the [Unapprove] and [Start Release] in a horizontally and vertically centered row
        <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1}>
            {/* TODO: Ersätt det hårdkodade värdet med en global variabel */}
            {user.department === 'NESE' ?
                <>
                    <Grid item>
                        <BlueSubmitButton buttonName="unapprove" buttonText="Unapprove" />
                    </Grid>
                    <Grid item>
                        <Button style={{ backgroundColor: "#4CBB17", color: "white" }}
                            variant="contained" onClick={ handleClickOpenReleaseTaskPopUp }>
                            Start Calibration
                        </Button>

                        <ReleaseTaskPopUp 
                            orderId={orderId}
                            openReleaseTaskPopUp={openReleaseTaskPopUp}
                            handleCloseReleaseTaskPopUp={handleCloseReleaseTaskPopUp}
                            startReleaseProcess={startReleaseProcess}
                            orderDetails={orderDetails}
                            setStoryLink={setStoryLink}
                        ></ReleaseTaskPopUp>
                    </Grid>
                </>
                : null
            }
        </Grid>
    )
}
