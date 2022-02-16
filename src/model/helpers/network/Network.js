/**
 * Sends a HTTP GET request to <urlEndPoint> with a basic
 * authentication in the header consisting of encoded
 * JSON values.
 * @param {*} urlEndPoint 
 * @param {*} serializedJSON 
 * @returns 
 */
 export function sendGetLogin(urlEndPoint, serializedJSON) {
    let login_info = JSON.parse(serializedJSON)
    const response = fetch(urlEndPoint, {
        withCredentials: true,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${btoa(`${login_info.username}:${login_info.password}`)}`
        },
    });
    return response;
}

/**
 * @param {String} urlEndPoint 
 * @param {String} serializedJSON 
 * Sends a HTTP POST request to <urlEndPoint> with a serialized
 * JSON object in the request body.
 * @returns {Promise} A promise associated with the sent request
 */
export function sendJson(urlEndPoint, serializedJSON) {
    const response = fetch(urlEndPoint, {
        withCredentials: true,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem('user_info')
        },
        body: serializedJSON,
    });
    return response;
}

/**
 * @param {String} urlEndPointAndArgs
 * Sends a HTTP POST request to the specified url-end-point with specified arguments
 * @returns A promise associated with the sent request
 */
export function sendPost(urlEndPointAndArgs) {
    const response = fetch(urlEndPointAndArgs, {
        method: "POST",
        headers: {
            "x-access-token": localStorage.getItem('user_info')
        },
    });
    return response;
}

/**
 * @param {String} urlEndPointAndArgs 
 * Sends a HTTP GET request to the specified url-end-point with the specified arguments
 * @returns A promise associated with the sent request
 */
export function sendGet(urlEndPointAndArgs) {
    const response = fetch(urlEndPointAndArgs, {
        method: "GET",
        headers: {
            "x-access-token": localStorage.getItem('user_info')
        },
    });
    return response;
}