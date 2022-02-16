/**
 * @param {Event} onSubmitEvent - an onSubmit event
 * 
 * Captures the input field values and requested action (i.e. "approve", "save")
 * for an onSubmit event.
 * 
 * @returns { {Object}, {String} } { fieldValues, requestedAction  }
 */
export function captureForm(onSubmitEvent) {
    const requestedAction = onSubmitEvent.nativeEvent.submitter.name; //the name attribute of the button triggering the onSubmit event
    const formData = new FormData(onSubmitEvent.target);
    const fieldValues = Object.fromEntries(formData.entries());
    return { fieldValues, requestedAction };
}