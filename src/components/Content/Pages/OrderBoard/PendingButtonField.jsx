import { useContext, useEffect, useState } from 'react'
import { Grid } from '@material-ui/core'

import { UserContext } from '../../../../model/state/UserContext';
import { BlueSubmitButton, RedSubmitButton } from '../../../../model/helpers/button/FormButton';

function isReleaseManager(user) {
    return user.department === "NESE";
}

/**
 * 
 * @param {*} user 
 * @param {*} orderId 
 * @returns True if the order id exists in user.orders array, else return false.
 */
function isOrderCreator(user, orderId) {
    return user.orders.includes(parseInt(orderId));
}

/**
 * Shows the appropriate buttons when an unapproved order
 * is being displayed in OrderInfo.
 * 
 * Displays buttons [Approve] [Edit] for release managers
 * and nothing for regular users.
 * Pressing [Edit] triggers the displaying of
 * buttons: [Cancel] [Save]
 * Pressing [Cancel] brings back [Approve] [Edit]
 * 
 * @prop {Boolean} showCancelSave - tells if [Cancel] [Save] buttons should be shown
 */
export default function PendingButtonField({ showCancelSave, orderId }) {
    const { user } = useContext(UserContext)
    const [buttons, setButtons] = useState([])

    //Get the appropriate buttons based on user permission
    function getButtons() {
        if (isReleaseManager(user) && !showCancelSave) {
            return <>
                <Grid item>
                    <BlueSubmitButton buttonName="approve" buttonText="Approve"/>
                </Grid>
                <Grid item>
                    <BlueSubmitButton buttonName="edit" buttonText="Edit"/>
                </Grid>
                <Grid item>
                    <RedSubmitButton buttonName="delete" buttonText="Delete"/>
                </Grid>
            </>
        }
        else if (isOrderCreator(user, orderId) && !showCancelSave) {
            return <>
                <Grid item>
                    <BlueSubmitButton buttonName="edit" buttonText="Edit"/>
                </Grid>
                <Grid item>
                    <RedSubmitButton buttonName="delete" buttonText="Delete"/>
                </Grid>
            </>
        }
        else if (showCancelSave) {
            return <>
                <Grid item>
                    <BlueSubmitButton buttonName="cancel" buttonText="Cancel"/>
                </Grid>
                <Grid item>
                    <BlueSubmitButton buttonName="save" buttonText="Save"/>
                </Grid>
            </>;
        }

    }

    useEffect(() => {
        setButtons(getButtons);
    }, [showCancelSave, orderId])
    return (
        <Grid container direction="row" alignItems="center" justifyContent="center" spacing={1}>
            { buttons }
        </Grid>
    )
}
