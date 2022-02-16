import { useEffect, useRef } from "react";
import { sendGet } from "../../../../../model/helpers/network/Network";
import { startLoader, stopLoader } from "../../../../../model/helpers/LoadingIndicator";

/**
 * Helper functions used in all BackOffice components.
 */
const CommonHelpers = {   
    /**
     * Updates fieldvalues.
     * 
     * @param {*} field The field to update.
     * @param {*} newValue The new value for the field.
     */
    changeValue: function (updateField, field, newValue) {
        updateField({
        type: "UPDATE_FIELD", payload:
            { field: field, newValue: newValue }
        });
    },
    
    /* Handles requested changes to the field value state */
    valueReducer: function (state, action) {
        switch (action.type) {
            case "UPDATE_FIELD": {
                const newValue = action.payload.newValue;
                const field = action.payload.field;
                const newState = { ...state, [field]: newValue }
                return newState;
            }
            default: {
                throw new Error("Recieved unknown action.type in valueReducer");
            }
        }
    },

    /* Like useEffect but does not run on first render. */
    useDidMountEffect: (func, deps) => {
        const didMount = useRef(false);
        useEffect(() => {
            if (didMount.current) func();
            else didMount.current = true;
        }, deps);
    },

    /**
     * Gets the latest bsw version of a system.
     * 
     * @param {String} system
     */
     getLatestVersion: async function (system) {
        startLoader();
        const response = await sendGet(`http://localhost:5000/bsw-versions?system=${system}`);
        const bswVersions = await response.json();
        return bswVersions[bswVersions.length-1].charAt(0);
    },
    
    /**
     * Sorts the projects depending on their system's latest BSW version, and then alphabetically. 
     * Each system gets a header with their system name in the list.
     */
    sortProjects: async function (projectsData, sortingType) {
        var track_8x = [];
        var track_7x = [];
        var track_6x = [];
        var aftertreatment = [];
        var others = [];
        for (let i = 0; i < projectsData.length; i++) {
            var systemName = projectsData[i].system ? projectsData[i].system : "";
            var projectName = projectsData[i].name ? projectsData[i].name : "";
            var projectId = projectsData[i].id;
            var version = systemName === "" ? "" : await this.getLatestVersion(systemName);
            var project = sortingType === 'createOrder' ? {name: projectName} : { name: projectName, id: projectId, system: systemName };

            //If project name contains AMS or EEC, sort it as Aftertreatment.
            if (projectName.includes('AMS') || projectName.includes('EEC')) {
                aftertreatment.push(project);
            } else if (version === '8') {
                track_8x.push(project);
            } else if (version === '7') {
                track_7x.push(project);
            } else if (version === '6') {
                track_6x.push(project);
            } else {
                others.push(project);
            }
        }
        
        track_8x.sort((projecta,projectb)=>projecta.name.localeCompare(projectb.name));
        track_7x.sort((projecta,projectb)=>projecta.name.localeCompare(projectb.name));   
        track_6x.sort((projecta,projectb)=>projecta.name.localeCompare(projectb.name));   
        aftertreatment.sort((projecta,projectb)=>projecta.name.localeCompare(projectb.name));   
        others.sort((projecta,projectb)=>projecta.name.localeCompare(projectb.name));

        // Add system categorization headers.
        aftertreatment.unshift({name:'Aftertreatment:'});
        track_8x.unshift({name:'Track 8x:'});
        track_7x.unshift({name:'Track 7x:'});
        track_6x.unshift({name:'Track 6x:'});
        others.unshift({name:'Others:'});

        var projects = [];
        stopLoader();
        return projects.concat(track_8x,track_7x,track_6x,aftertreatment,others);
    }
}

export default CommonHelpers;