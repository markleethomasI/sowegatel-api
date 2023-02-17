const AjvValidateMiddleware = require("ajv-validate-middleware");
const validateMiddleware = new AjvValidateMiddleware();
const mongoose = require("mongoose");

const schemaArray = require("../validators");

validateMiddleware.addFormat("ObjectId", {
    type: "string",
    validate: function (x) {
        return mongoose.Types.ObjectId.isValid(x);
    },
});

// Adds e164 format to verify numbers are in e164
validateMiddleware.addFormat("e164", {
    type: "string",
    validate: function(x) {
        return /^\+[1-9]\d{10}$/.test(x);
    }
})

validateMiddleware.addFormat('UserPassword', {
    type: "string",
    validate: function (x) {
        if(x.length < process.env.PASSWORD_POLICY_MIN_LENGTH) return false
        return true
    }
})

schemaArray.forEach((schema) => {
    validateMiddleware.createSchema(schema);
});

module.exports = validateMiddleware;
