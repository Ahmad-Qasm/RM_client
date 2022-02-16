import { useState, useContext } from 'react';
import { Grid } from '@material-ui/core'
import Cookies from 'js-cookie'

import { notifySuccess, notifyFailed, notifyWarning } from '../../../../model/helpers/Notifiers';
import InputFields from '../../../Form/InputFields';
import { captureForm } from '../../../../model/helpers/form/CaptureForm';
import { sendJson } from '../../../../model/helpers/network/Network';
import { startLoader, stopLoader } from '../../../../model/helpers/LoadingIndicator';
import { UserContext } from '../../../../model/state/UserContext';
import { BlueSubmitButton } from '../../../../model/helpers/button/FormButton';

/*Helper functions*/
// TODO: flytta om den passar bättre i utility/helpers
async function sendData(data, user, setUser) {
    try {
        const response = await sendJson(`http://127.0.0.1:5000/new-order`,
            data);

        if (response.status === 201) {

            // Update User and Cookie with the new order
            const orderInfo = await response.json();
            user.orders.push(parseInt(orderInfo.id));
            setUser(user);
            Cookies.set(user);

            notifySuccess("Created order");
        }
        else if (response.status === 405)
            notifyWarning("Could not connect to mailserver. Check vpn connection!");
        else if (response.status === 502)
            notifyWarning("Order was created, but mail was not sent");
        else
            notifyFailed("Failed to create order");
    } catch (error) {
        notifyFailed("Failed to create order");
    }
}

/**
 * Displays input fields for order information and a button to
 * create the order and save it in the database.  
 */
export default function CreateOrder() {
    const [validateTrigger, setValidateTrigger] = useState({});
    const { user, setUser } = useContext(UserContext)

    //Triggers validation proccess in child component: InputFields
    function checkValid(event) {
        event.preventDefault();
        setValidateTrigger(event);
    }

    //Called after validation process in InputFields if fields are valid
    async function createOrder(event) {
        const { fieldValues } = captureForm(event);
        const serializedFormData = JSON.stringify(fieldValues);
        startLoader();
        await sendData(serializedFormData, user, setUser);
        stopLoader();
    }

    return (
        // Display the InputFields and BlueSubmitButton in a vertically and horizontally centered column,
        // don't break column structure by using flexWrap: nowrap
        <form style={{ height: "100%", width: "100%" }}
             onSubmit={checkValid}>
            <Grid container direction="column" alignItems="center" justifyContent="center"
                spacing={1} style={{ flexWrap: "nowrap", height: "auto",}}>
                <Grid item>
                    <InputFields
                        callIfFormIsValid={createOrder}
                        validateTrigger={validateTrigger}
                        readOnly={false}
                        passedData={null} />
                </Grid>

                <Grid item>
                    <BlueSubmitButton buttonName="create" buttonText="Create Order" />
                </Grid>
            </Grid>
        </form>
    )
}
