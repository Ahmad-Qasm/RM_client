import { useEffect, useState } from 'react';
import {
    Grid, makeStyles, List, ListItemText, ListItem, ListItemIcon,
    Card, CardHeader, Checkbox, Button, Divider, Dialog, TextField, Typography
} from '@material-ui/core'

import { sendGet } from '../../../../model/helpers/network/Network';
import { startLoader, stopLoader }
    from '../../../../model/helpers/LoadingIndicator';
import { ENGINES, BSW_VERSION, ENGINES_EMISSIONSTANDARD, ENGINES_NAME, ENGINES_POWER, PROJECT, SYSTEM }
    from '../../../../model/helpers/form/FieldConstants'
import { EMPTY } from '../../../../model/helpers/form/Validator';
import { FieldLabels, PlaceHolders } from '../../../../model/helpers/form/FieldTemplate';

const useStyles = makeStyles((theme) => ({
    list: {
        width: 300,
        height: 400,
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
    },
    errorMessage: {
        color: "red",
        textAlign: "center"
    },
    button: {
        margin: theme.spacing(0.5, 0),
    },
    dialog: {
        "& .MuiDialog-paper": {
            //Style the Paper-component of the dialog here
            overflowY: "unset",
            width: 300,
            height: 300,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center"
        },
        "& .MuiBox-root": {
            height: "auto !important",
            marginBottom: theme.spacing(2)
        },
        "& .MuiDialog-paperWidthSm": {
            //Remove max width and height restrictions
            maxWidth: "none",
            maxHeight: "none",
        }
    },
}));

/**
 * 
 * @param {Array} engines1 an array of engines
 * @param {Array} engines2 an array of engines
 * 
 * Compares engine elements by name to get the engines that only are in 
 * engines1
 * 
 * @returns an array with the engines from engines1 that are not in engines2.
 */
function differenceEngines(engines1, engines2) {
    const difference = [];
    for (let i in engines1) {
        const engine = engines1[i];

        //check if engine exists in both arrays
        let existsInBoth = false;
        for (let j in engines2) {
            const engineToCompare = engines2[j];
            if (engine.name === engineToCompare.name)
                existsInBoth = true;
        }
        if (!existsInBoth)
            difference.push(engine);
    }
    return difference;
}

/**
 * Perform a union of two arrays of engines.
 * 
 * @param {Array} engine1 
 * @param {Array} engine2 
 * @returns The engines in engines1 and the engines in engines2 without duplicates
 */
function unionEngines(engines1, engines2) {
    var union = engines1.concat(engines2);

    for (var i = 0; i < union.length; i++) {
        for (var j = i + 1; j < union.length; j++) {
            if (union[i].name === union[j].name) {
                union.splice(j, 1);
                j--;
            }
        }
    }

    return union;
}

/** 
 * @param {Array} a
 * @param {Array} b
 * @returns An array with the values a and b have in common (i.e the intersection)
 *          ex. a: [1,2,3,4,5] b: [2,3,8] ==> intersection(a,b): [2,3]
 */
function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

/**
 * @param {Array} a 
 * @param {Array} b 
 * @returns {Array} An array with the contents of a that are not in b
 *                  ex. a: [1,2,3,4,5] b: [2,3] ==> difference(a,b): [1,4,5]  
 */
function difference(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

/**
 * 
 * @param {Array} a 
 * @param {Array} b 
 * @returns An array with the values from a and b without duplicates
 *          ex a: [1,2,3] b: [1,2,3,4,5] ==> union(a,b): [1,2,3,4,5] 
 */
function union(a, b) {
    return [...a, ...difference(b, a)];
}

/**
 * Displays the choices of engines and the chosen engines for an order in
 * two lists (choices & chosen).
 * 
 * Allows engines in either list to be moved to its counter-part
 *  (i.e from choices->chosen and choices<-chosen) unless in read-only mode.
 * 
 * This transferlist provides a local save functionality through the use of a button [Save].
 *  - There must be at least one engine selected for the save button to be enabled.
 * 
 * OBS: As of 2021-05-25 the chosen engines are stored as a
 *      serialized array of engines in an hidden <input>-element like this:
 *      <input hidden="true" type="text" value="[{engine1},...,{engineN}]">-element
 * 
 * @prop {Boolean} readOnly - should transferlist be modifiable?
 * @prop {Object} fieldValues - a key-value pair of field identifiers and their values
 * @prop {function} save - save chosen engines to the fieldValues
 * @prop {function} storeEngine - store an engine in the parent-component
 * @prop {Array} locallyStoredEngines - an array of locally stored custom engines
 */
export default function TransferList({ save, locallyStoredEngines, storeEngine, readOnly,
    fieldValues }) {
    // TODO: Investigate if refactoring is required, are all lists needed?
    const classes = useStyles();
    const currentlyChosenEngines = fieldValues[ENGINES];
    const [checked, setChecked] = useState([]); //keeps track of checked engines
    const [choicesList, setChoicesList] = useState([]);
    const [chosenList, setChosenList] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newEngineName, setNewEngineName] = useState("");
    const [newEngineHP, setNewEngineHP] = useState("");
    const [newEngineES, setNewEngineES] = useState("");

    const leftChecked = intersection(checked, choicesList);
    const rightChecked = intersection(checked, chosenList);

    /**
     * Add a new non-comptrans-engine to the choices of engines and store it in the parent component.
     * Custom engines are stored in the parent component for the sake of persisting their values when
     * toggling the transferlist.
     */
    function addNewEngine() {
        let newEngine = {};
        newEngine.name = newEngineName;
        newEngine.power = newEngineHP;
        newEngine.emissionStandard = newEngineES;

        storeEngine(newEngine);

        const choicesCopy = choicesList.slice();
        choicesCopy.push(newEngine);
        setChoicesList(choicesCopy);

        setDialogOpen(false);
    }

    /* Toggles the checkbox of an engine */
    function toggleCheckbox(engine) {
        const indexOfEngine = checked.indexOf(engine);
        const newChecked = [...checked]; //Create a copy of list "checked"

        //if engine not checked add it to checked list
        if (indexOfEngine === -1) {
            newChecked.push(engine);
        } else {
            //if checked remove it from checked list
            newChecked.splice(indexOfEngine, 1);
        }
        setChecked(newChecked);
    }

    /* Returns true if the bsw version is picked in the order form*/
    function bswVersionIsPicked() {
        return !(fieldValues[BSW_VERSION] === EMPTY);
    }

    /* Returns the number of checked engines */
    function numberOfChecked(engines) {
        return intersection(checked, engines).length;
    }

    /* Toggles all checkboxes for either the chosen-list or choices-list */
    function toggleAllCheckboxes(engines) {
        if (numberOfChecked(engines) === engines.length)
            setChecked(difference(checked, engines));
        else
            setChecked(union(checked, engines));
    }

    /* Moves checked engines in choicesList to chosenList*/
    function moveToChosenList() {
        setChosenList(chosenList.concat(leftChecked));
        setChoicesList(difference(choicesList, leftChecked));
        setChecked(difference(checked, leftChecked));
    }

    /* Moves checked engines in chosenList to choicesList*/
    function moveToChoicesList() {
        setChoicesList(choicesList.concat(rightChecked));
        setChosenList(difference(chosenList, rightChecked));
        setChecked(difference(checked, rightChecked));
    }

    /* Returns an array of ListItem components with engine names and associated checkboxes */
    function generateListOfEngines(engines) {
        return engines.map((engine) => {
            const labelId = `transfer-list-all-item-${engine.name}-label`;
            return (
                <ListItem key={engine} role="listitem" button onClick={() => toggleCheckbox(engine)}>
                    <ListItemIcon>
                        <Checkbox
                            checked={checked.indexOf(engine) !== -1}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ 'aria-labelledby': labelId }}
                        />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={`${engine.name}`} />
                </ListItem>
            );
        })
    }

    /**
     * Generates the left and right column of the transferlist and loads them with a list of engines.
     */
    function columnGenerator(title, engines) {
        return (
            <Card>
                <CardHeader
                    style={{ paddingTop: 8, paddingBottom: 8, paddingRight: 16, paddingLeft: 16 }}
                    avatar={
                        <Checkbox
                            onClick={() => toggleAllCheckboxes(engines)}
                            checked={numberOfChecked(engines) === engines.length && engines.length !== 0}
                            indeterminate={numberOfChecked(engines) !== engines.length &&
                                numberOfChecked(engines) !== 0}
                            disabled={engines.length === 0}
                        />
                    }
                    title={title}
                    subheader={`${numberOfChecked(engines)}/${engines.length} selected`}
                />
                <Divider />

                <List className={classes.list} dense component="div" role="list">
                    {/* Show error message if BSW Version is not picked */}
                    {!bswVersionIsPicked() ?
                        <p className={classes.errorMessage}>BSW Version must be picked before choosing engines</p> :
                        <>
                            {generateListOfEngines(engines)}
                            < ListItem />
                        </>
                    }
                </List>
            </Card>);
    }

    /**
     * Load not-chosen-engines that are from comptrans or custom into the choices-list and maintain
     * persistancy for the custom-engines when closing down the transferlist. Persistancy is 
     * maintained by passing the custom engines to the parent component.
     */
    async function loadChoices() {
        startLoader();
        const promise =  await sendGet(`http://127.0.0.1:5000/engines?system=${fieldValues[SYSTEM]}&version=${fieldValues[BSW_VERSION]}`);
        const comptransEngines = await promise.json();
        
        const customEnginesFromDB = differenceEngines(chosenList, comptransEngines);

        //Fill parent-component's state with the custom-engines to maintain their persistency
        //when closing the transferlist.
        for (const engine of customEnginesFromDB)
            storeEngine(engine);

        const allCustomEngines = unionEngines(customEnginesFromDB, locallyStoredEngines);
        const mergedEngines = unionEngines(comptransEngines, allCustomEngines);
        const notChosenEngines = differenceEngines(mergedEngines, chosenList);
        setChoicesList(notChosenEngines);
        stopLoader();
    }

    /**
     * Parses the currentlyChosenEngines and puts the engines into the chosen list
     */
    useEffect(() => {
        const deserializedData = JSON.parse(currentlyChosenEngines);
        setChosenList(deserializedData);
    }, [currentlyChosenEngines])

    /**
     * Loads the choices-list. Runs after the chosen-list has been loaded
     */
    useEffect(() => {
        if (!readOnly && bswVersionIsPicked())
            loadChoices();
    }, [chosenList])

    return (
        <>
            {/* Display a row of three columns: Engine choices, Move and save buttons, Chosen Engines
            with the theme-spacing 2 (2*8px = 16px) */}
            <Grid container spacing={2} justifyContent="center" alignItems="center">

                {/* The column with engine choices */}
                <Grid item>{columnGenerator('Choices', choicesList)}</Grid>

                {/* The move buttons & save button */}
                <Grid item>
                    {!readOnly ?
                        <Grid container direction="column" alignItems="center">
                            <Button
                                variant="outlined"
                                size="small"
                                className={classes.button}
                                onClick={() => setDialogOpen(true)}
                            >Add New</Button>
                            <Button
                                variant="outlined"
                                size="small"
                                className={classes.button}
                                onClick={moveToChosenList}
                                disabled={leftChecked.length === 0}
                            >
                                &gt;
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                className={classes.button}
                                onClick={moveToChoicesList}
                                disabled={rightChecked.length === 0}
                            >
                                &lt;
                            </Button>
                            {chosenList.length === 0 ?
                                null :
                                <Button
                                    variant="outlined"
                                    size="small"
                                    className={classes.button}
                                    onClick={() => { save(chosenList) }}
                                >
                                    SAVE
                                </Button>}
                        </Grid>
                        : null}
                </Grid>

                {/* The column with chosen engines */}
                <Grid item>{columnGenerator('Chosen', chosenList)}</Grid>
            </Grid>

            {/* Display a dialog containing a label, textfield and button for adding a new 
            bsw-version */}
            <Dialog
                onClose={() => { setDialogOpen(false) }}
                open={dialogOpen} className={classes.dialog}>
                <Typography>{FieldLabels[ENGINES_NAME]}</Typography>
                <TextField
                    size="small"
                    inputProps={{
                        readOnly: readOnly,
                    }}
                    variant="outlined"
                    value={newEngineName}
                    placeholder={PlaceHolders[ENGINES_NAME]}
                    onChange={(e) => setNewEngineName(e.target.value)}
                />

                <Typography>{FieldLabels[ENGINES_EMISSIONSTANDARD]}</Typography>
                <TextField
                    size="small"
                    inputProps={{
                        readOnly: readOnly,
                    }}
                    variant="outlined"
                    value={newEngineES}
                    placeholder={PlaceHolders[ENGINES_EMISSIONSTANDARD]}
                    onChange={(e) => setNewEngineES(e.target.value)}
                />

                <Typography>{FieldLabels[ENGINES_POWER]}</Typography>
                <TextField
                    size="small"
                    inputProps={{
                        readOnly: readOnly,
                    }}
                    variant="outlined"
                    value={newEngineHP}
                    placeholder={PlaceHolders[ENGINES_POWER]}
                    onChange={(e) => setNewEngineHP(e.target.value)}
                />

                <Button style={{
                    backgroundColor: "#3f51b5",
                    color: "white"
                }}
                    variant="contained"
                    name="confirm"
                    onClick={addNewEngine}
                >confirm</Button>
            </Dialog>
        </>
    );
}