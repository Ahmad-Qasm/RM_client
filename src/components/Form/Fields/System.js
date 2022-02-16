import { useState, useEffect, useRef } from 'react'
import { Typography, TextField, Box } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { PROJECT,SYSTEM } from '../../../model/helpers/form/FieldConstants'
import { FieldLabels, PlaceHolders } from '../../../model/helpers/form/FieldTemplate';
import { sendGet } from '../../../model/helpers/network/Network';

/* Like useEffect but does not run on first render. */
const useDidMountEffect = (func, deps) => {
  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
}

/**
 * System field used in the order form.
 * 
 * Uses Autocomplete from material-ui to allow for system-searching in a 
 * text field with a dropdown menu showing matching alternatives
 * 
 * @prop {Function(Object)} updateField - dispatch an update field action
 * @prop {Object} fieldValues - key-value pair:
 *                             (field identifier)-->(field value)
 *  @prop {Boolean} readOnly - should field value be read only?
 * 
 */
export default function System({updateField, fieldValues,readOnly}){
    const [systems, setSystems] = useState([]);
    const [selectedValue, setSelectedValue] = useState(null);
    const currentProject = fieldValues[PROJECT];
    

  /**
   * Add all systems from the backend.
   */
    async function getSystems() {
        const resp = await sendGet(`http://localhost:5000/systems`);
        const systems = await resp.json();
        systems.sort((systema,systemb)=>systema.localeCompare(systemb));
        setSystems(systems);
      }

    /** Select the default system automatically for a project */  
      async function getSpecificSystem() {
        const resp = await sendGet(`http://localhost:5000/project?name=${fieldValues[PROJECT]}`);
        const project = await resp.json();
        let system = project.system;
        setSelectedValue(system);
      }

      useDidMountEffect(() => {
        if (readOnly)
          return;
        setSelectedValue(null);
        updateField({
          type: "UPDATE_FIELD", payload:
            { field: SYSTEM, newValue: "" }
        });
        getSpecificSystem();
        getSystems();
      }, [currentProject])
     
    /**
   * Change the textfield value
   * 
   * Is called when a user manually enters text in the textfield and when a value is selected
   * from the dropdown list
   * @param {Event} event - (used for pattern matching only)
   * @param {String} newValue - the value to change for the TextField
   */
      function changeValue(event, newValue) {
        if (!readOnly)
          updateField({
            type: "UPDATE_FIELD", payload:
              {field: SYSTEM, newValue: newValue}
          });
      }

      function changeSelected(event, newSelected) {
        setSelectedValue(newSelected);
      }

      return(
      <>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center"
        height="100%">
      <Typography>{FieldLabels[SYSTEM]}</Typography>
          <Autocomplete
              size="small"

              /* Selected value */
              value={selectedValue}
              onChange={changeSelected}
                
              /* Load list-options from systems  */
              options={systems}
              noOptionsText={"No matching systems"}

              /* TextField value */
              inputValue={fieldValues[SYSTEM]}
              onInputChange={changeValue}

              renderInput={(params) => <TextField {...params}
                  variant="outlined"
                  name={SYSTEM}
                  placeholder={PlaceHolders[SYSTEM]} />
                  }
          />
      </Box>
      </>)
} 