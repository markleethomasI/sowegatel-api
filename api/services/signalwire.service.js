const fetch = require("node-fetch");
const tokenService = require("./token.service");
const ApiError = require("../utils/ApiError");

// Set API Keys
const signalwireSpace = process.env.SIGNALWIRE_SPACE;
const projectId = process.env.SIGNALWIRE_PROJECT_ID;
const token = process.env.SIGNALWIRE_API_KEY;
const basicAuthHeaderToken = new Buffer(projectId + ":" + token).toString("base64");

/**
 *
 * @param {*} projectId
 * @param {*} token
 * @returns AuthHeader
 */
const generateBasicAuthHeaderToken = (projectId, token) => {
    return new Buffer(projectId + ":" + token).toString("base64");
};

/**
 * Takes object containing fetch parameters, wraps it in try catch, and returns json data from api
 * @param {Object} fetchData
 */

const fetchAndCatch = async (fetchData) => {
    try {
        const response = await fetch(fetchData.url, fetchData.params);

        const json = await response.json();

        if (response.status !== fetchData.expectedStatus) {
            throw new ApiError({
                responseCode: response.status,
                message: JSON.stringify(json.errors),
            });
        }

        return json;
    } catch (error) {
        throw new Error(error);
    }
};

/**
 * Takes in area code, retrieves list of numbers for given area code
 * @param {String} areaCode
 * @returns {Object} Json
 */
const getAvailablePhoneNumbers = async (areaCode) => {
    const json = await fetchAndCatch({
        url: `https://${signalwireSpace}.signalwire.com/api/relay/rest/phone_numbers/search?areacode=${areaCode}`,
        params: {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: "Basic " + basicAuthHeaderToken,
            },
        },
        expectedStatus: 200,
    });

    return json;
};

/**
 * Purchases number from signalwire
 * @param {*} phoneNumber
 * @returns {json}
 */
const buyAvailablePhoneNumber = async (phoneNumber, accountSid) => {
    // Generate token to apply number to right subproject
    const basicAuthHeader = generateBasicAuthHeaderToken(accountSid, token);

    const json = await fetchAndCatch({
        url: `https://${signalwireSpace}.signalwire.com/api/relay/rest/phone_numbers`,
        params: {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Basic " + basicAuthHeader,
            },
            body: JSON.stringify({ number: phoneNumber }),
        },
        expectedStatus: 200,
    });

    return json;
};

/**
 * Creates sub account in signalwire workspace
 * @param {*} FriendlyName
 * @returns
 */
const createSubAccount = async (name) => {
    const json = await fetchAndCatch({
        url: `https://${signalwireSpace}.signalwire.com/api/laml/2010-04-01/Accounts`,
        params: {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Basic " + basicAuthHeaderToken,
            },
            body: JSON.stringify({ FriendlyName: name }),
        },
        expectedStatus: 201,
    });

    return json;
};

/**
 * Creates sip endpoint 
 * @param {*} userName 
 * @param {*} password 
 * @param {*} sendAs 
 * @param {*} accountSid 
 * @returns {void}
 */

const createSipEndpoint = async (userName, password, sendAs, callerId, accountSid) => {
    // Generate token to apply number to right subproject
    const basicAuthHeader = generateBasicAuthHeaderToken(accountSid, token);

    const json = await fetchAndCatch({
        url: `https://${signalwireSpace}.signalwire.com/api/relay/rest/endpoints/sip`,
        params: {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Basic " + basicAuthHeader,
            },
            body: JSON.stringify({ username: userName, password,  send_as: sendAs, caller_id: callerId }),
        },
        expectedStatus: 200,
    });

    return json
};

const getSipEndpoints = async (accountSid) => {
        // Generate token to apply number to right subproject
        const basicAuthHeader = generateBasicAuthHeaderToken(accountSid, token);

        const json = await fetchAndCatch({
            url: `https://${signalwireSpace}.signalwire.com/api/relay/rest/endpoints/sip`,
            params: {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Basic " + basicAuthHeader,
                }
            },
            expectedStatus: 200,
        });
    
        return json
}

module.exports = { getAvailablePhoneNumbers, buyAvailablePhoneNumber, createSubAccount, createSipEndpoint, getSipEndpoints };
