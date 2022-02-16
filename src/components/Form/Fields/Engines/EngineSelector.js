import { useState, useEffect } from 'react';
import { makeStyles, Button, Dialog } from '@material-ui/core';

import { ENGINES, BSW_VERSION } from '../../../../model/helpers/form/FieldConstants';
import TransferList from './TransferList';

const useStyles = makeStyles({
    dialog: {
        "& .MuiDialog-paper": {
            //Style the Paper-component of the dialog here
            overflowY: "unset",
            width: 750,
            height: 500,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"

        },
        "& .MuiDialog-paperWidthSm": {
            //Remove max width and height restrictions
            maxWidth: "none",
            maxHeight: "none",
        }
    },
});

function noEnginesChosen(engineArray) {
    if (engineArray === "[]")
        return true;
    return false;
}

/** 
 * Wrapper for a button that opens a dialog when pressed.
 * The dialog contains a transferlist showing information about selected
 * and selectable engines.
 * 
 * OBS: As of 2021-05-25 the chosen engines are stored as a
 *      serialized array of engines in an hidden <input>-element like this:
 *      <input hidden="true" type="text" value="[{engine1},...,{engineN}]">-element
 * 
 * @prop {Boolean} updateField - used to update the value of the <input>-element holding engines data
 * @prop {Boolean} readOnly - passed down and used in child TransferList
 * @prop {Object} fieldValues - a key-value pair of field identifiers and their values
 */
export default function EngineSelector({ updateField, readOnly, fieldValues }) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [locallyStoredEngines, setStoredEngines] = useState([]);
    const chosenEngines = fieldValues[ENGINES];
    const currentBSW = fieldValues[BSW_VERSION];

    /**
     * Close the dialog and save the chosen engines to the input-field storing
     * engines.
     * @param chosenEngines - the chosen engines
     */
    function handleClose(chosenEngines) {
        //close dialog
        setOpen(false);

        //save chosen engines
        const serializedData = JSON.stringify(chosenEngines);
        updateField({
            type: "UPDATE_FIELD", payload:
                { field: ENGINES, newValue: serializedData }
        });
    }

    /**
     * 
     * Store an engine in the custom-engine-array to persist its visibility in the transferlist 
     * between the toggles
     * 
     * @param engine - the engine to store
     */
    function storeEngine(engine) {
        const customEnginesCopy = locallyStoredEngines.slice();
        customEnginesCopy.push(engine);
        setStoredEngines(customEnginesCopy);
    }

    /**
     * Reset field values if BSW_VERSION changes
     */
    useEffect(() => {
        if (readOnly)
            return;

        setStoredEngines([]);    
        updateField({
            type: "UPDATE_FIELD", payload:
                { field: ENGINES, newValue: "[]" }
        });
    }, [currentBSW])


    return (
        //Display a Select Engines-button and show a dialog presenting a transferlist when the 
        //button is pressed 
        <>
            <Button style={{ width: "100%" }} variant="outlined"
                color={noEnginesChosen(chosenEngines) ? "secondary" : "primary"}
                onClick={() => { setOpen(true) }}
            >
                {readOnly ? "Selected Engines" : "Select Engines"}
            </Button>
            <Dialog
                onClose={() => { setOpen(false) }}
                open={open} className={classes.dialog}>
                <TransferList
                    locallyStoredEngines={locallyStoredEngines}
                    storeEngine={storeEngine}
                    save={handleClose}
                    readOnly={readOnly}
                    fieldValues={fieldValues} />
            </Dialog>
            <input hidden={true} name={ENGINES}
                value={fieldValues[ENGINES]} />
        </>
    );
}
