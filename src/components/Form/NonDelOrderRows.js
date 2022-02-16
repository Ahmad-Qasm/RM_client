import React from 'react'

import Row from './Row';
import { InputFieldFactory } from './Fields/InputFieldFactory';
import EngineSelector from './Fields/Engines/EngineSelector';
import BSWVersion from './Fields/BSWVersion';
import Status from './Fields/Status';
import Project from './Fields/Project';
import * as Consts from '../../model/helpers/form/FieldConstants';
import System from './Fields/System';
import CustomerSelector from './Fields/CustomerSelector';

/**
 * Collection of rows containing non-delorder inputfields
 * 
 * @prop {Function} updateField - update the value of a field
 * @prop {Object} validationState - the state of validation for each field
 * @prop {Object} fieldValues - the field values
 * @prop {Boolean} readOnly - should the rows be read only?  
 */
export default function NonDelOrderRows({ updateField, validationState, fieldValues, readOnly,
    updateValidationState, orderState }) {
    return (
        // Display rows of non delorder input fields 
        <>
        {orderState != null ?
            <Row component1={<InputFieldFactory
                    fieldId={Consts.PROJECT_RESPONSIBLE}
                    readOnly={readOnly}
                    updateField={updateField}
                    validationState={validationState}
                    fieldValues={fieldValues}
                    hoverText="Release manager responsible for the project"/>}
            />
            : null}
            <Row component1={<Project
                    readOnly={readOnly}
                    updateField={updateField}
                    validationState={validationState}
                    fieldValues={fieldValues}/>}

                component2={<System 
                    updateField={updateField}
                    fieldValues={fieldValues}
                    readOnly={readOnly}/>} 
            />

            <Row component1={<InputFieldFactory
                    fieldId={Consts.SOP_SOCOP}
                    readOnly={readOnly}
                    updateField={updateField}
                    validationState={validationState}
                    fieldValues={fieldValues}
                    hoverText="e.g. 202104.1"/>}

                component2={<InputFieldFactory
                    fieldId={Consts.TYPE_OF_RELEASE}
                    readOnly={readOnly}
                    updateField={updateField}
                    validationState={validationState}
                    fieldValues={fieldValues}
                    hoverText="e.g. OTI and Wintertest"/>} 
            />

            <Row component1={<Status readOnly={readOnly}
                    updateField={updateField}
                    validationState={validationState}
                    fieldValues={fieldValues}/>}

                component2={<BSWVersion readOnly={readOnly}
                    updateField={updateField}
                    validationState={validationState}
                    updateValidationState={updateValidationState}
                    fieldValues={fieldValues}/>} 
            />

            <Row component1={<InputFieldFactory
                    fieldId={Consts.REL_MEETING_WEEK}
                    readOnly={readOnly}
                    updateField={updateField}
                    validationState={validationState}
                    fieldValues={fieldValues}
                    hoverText="e.g. w2104"/>}

                component2={<InputFieldFactory
                    fieldId={Consts.FILES_ON_SERVER_WEEK}
                    readOnly={readOnly}
                    updateField={updateField}
                    validationState={validationState}
                    fieldValues={fieldValues}
                    hoverText="e.g. w2104"/>} 
            />

            <Row component1={<InputFieldFactory
                    fieldId={Consts.PROJECT_MECO}
                    readOnly={readOnly}
                    updateField={updateField}
                    validationState={validationState}
                    fieldValues={fieldValues}
                    hoverText="e.g. 561741"/>}

                component2={<InputFieldFactory
                    fieldId={Consts.PROJECT_ACCOUNT_NUMBER}
                    readOnly={readOnly}
                    updateField={updateField}
                    validationState={validationState}
                    fieldValues={fieldValues}
                    hoverText="e.g. 59-694800"/>} 
            />
            <Row component1={<CustomerSelector
                updateField={updateField}
                fieldValues={fieldValues}
                readOnly={readOnly}
            />}

                component2={<EngineSelector 
                    updateField={updateField}
                    fieldValues={fieldValues}
                    readOnly={readOnly}
                />} 
            />
        </>
    )
}
