import React from 'react'

import { InputFieldFactory } from './Fields/InputFieldFactory'
import Row from './Row';
import * as Consts from '../../model/helpers/form/FieldConstants'

/**
 * Collection of rows containing delorder dates and comments
 * 
 * @prop {Function} updateField - update the value of a field
 * @prop {Object} validationState - the state of validation for each field
 * @prop {Object} fieldValues - the field values
 * @prop {Boolean} readOnly - should the rows be read only?  
 */
export default function DelOrderRows({ updateField, validationState, fieldValues, readOnly }) {
        // TODO: Kolla om effektivisering kan ske av factory design pattern i.e. skapa alla fält 
        // med hjälp av en funktion som itererar alla field-ids. Lägg till alla generiska fält i
        // denna komponent (och byt namn på komponenten)
    return (
        // Display rows of delorder-related input fields 
        <>
            <Row component1={<InputFieldFactory
                fieldId={Consts.DELORDER_A_DATE}
                readOnly={readOnly}
                updateField={updateField}
                validationState={validationState}
                fieldValues={fieldValues}
                hoverText="e.g. w2104"
            />}
                component2={<InputFieldFactory
                    fieldId={Consts.DELORDER_A_COMMENT}
                    updateField={updateField}
                    fieldValues={fieldValues}
                    readOnly={readOnly}
                    validationState={validationState}
                    hoverText="e.g. Ready for HW calibration"
                />} />

            <Row component1={<InputFieldFactory
                readOnly={readOnly}
                fieldId={Consts.DELORDER_B_DATE}
                updateField={updateField}
                validationState={validationState}
                fieldValues={fieldValues}
                hoverText="e.g. w2105"
            />}
                component2={<InputFieldFactory
                    readOnly={readOnly}
                    fieldId={Consts.DELORDER_B_COMMENT}
                    updateField={updateField}
                    validationState={validationState}
                    fieldValues={fieldValues}
                    hoverText="e.g. Ready for SW calibration"
                />} />

            <Row component1={<InputFieldFactory
                readOnly={readOnly}
                fieldId={Consts.DELORDER_C_DATE}
                updateField={updateField}
                validationState={validationState}
                fieldValues={fieldValues}
                hoverText="e.g. w2106"
            />}
                component2={<InputFieldFactory
                    readOnly={readOnly}
                    fieldId={Consts.DELORDER_C_COMMENT}
                    updateField={updateField}
                    validationState={validationState}
                    fieldValues={fieldValues}
                    hoverText="e.g. Ready for optimization calibration"
                />} />

            <Row component1={<InputFieldFactory
                readOnly={readOnly}
                fieldId={Consts.DELORDER_D_DATE}
                updateField={updateField}
                validationState={validationState}
                fieldValues={fieldValues}
                hoverText="e.g. w2107"
            />}
                component2={<InputFieldFactory
                    readOnly={readOnly}
                    fieldId={Consts.DELORDER_D_COMMENT}
                    updateField={updateField}
                    validationState={validationState}
                    fieldValues={fieldValues}
                    hoverText="e.g. Ready for vehicle calibration"
                />} />

            <Row component1={<InputFieldFactory
                readOnly={readOnly}
                fieldId={Consts.DELORDER_E_DATE}
                updateField={updateField}
                validationState={validationState}
                fieldValues={fieldValues}
                hoverText="e.g. w2108"
            />}
                component2={<InputFieldFactory
                    readOnly={readOnly}
                    fieldId={Consts.DELORDER_E_COMMENT}
                    updateField={updateField}
                    validationState={validationState}
                    fieldValues={fieldValues}
                    hoverText="e.g. Ready for test"
                />} />

            <Row component1={<InputFieldFactory
                readOnly={readOnly}
                fieldId={Consts.DELORDER_F_DATE}
                updateField={updateField}
                validationState={validationState}
                fieldValues={fieldValues}
                hoverText="e.g. w2108"
            />}
                component2={<InputFieldFactory
                    readOnly={readOnly}
                    fieldId={Consts.DELORDER_F_COMMENT}
                    updateField={updateField}
                    validationState={validationState}
                    fieldValues={fieldValues}
                    hoverText="e.g. Ready for production"
                />} />
        </>
    )
}
