const Schemas = [
    {
        register: {
            type: "object",
            properties: {
                firstName: { type: "string" },
                lastName: { type: "string" },
                companyName: { type: "string" },
                email: { type: "string" },
                password: { type: "string", format: 'UserPassword' },
            },
            required: ["email", "password", "firstName", "lastName", "companyName"],
            errorMessage: {
                required: "email, password, firstName, lastName, companyName are required",
                properties: {
                    password: "Password should be a string with greater than 7 characters",
                },
            },
        },
    },
    {
        login: {
            type: "object",
            properties: {
                email: {
                    type: "string",
                    format: "email",
                },
                password: {
                    type: "string",
                },
            },
            required: ["email", "password"],
            errorMessage: {
                type: "Should be an Object",
                required: {
                    email: "Email is required",
                    password: "Password is required",
                },
                properties: {
                    email: "A valid email is required",
                },
            },
        },
    },
    {
        user: {
            type: "object",
            properties: {
                firstName: {
                    type: "string",
                },
                lastName: {
                    type: "string",
                },
                email: {
                    type: "string",
                    format: "email",
                },
            },
            required: ["firstName", "lastName", "email"],
            errorMessage: {
                type: "Should be an Object",
                required: {
                    email: "Email is required",
                    firstName: "firstName is required",
                    lastName: "lastName is required",
                },
                properties: {
                    email: "A valid email is required",
                },
            },
        },
    },
    {
        userId: {
            type: "object",
            properties: {
                userId: {
                    type: "string",
                    format: "ObjectId",
                },
            },
            required: ["userId"],
            errorMessage: {
                properties: {
                    userId: "User id must be valid",
                },
            },
        },
    },{
        sipEndpoint: {
            type: "object",
            properties: {
                userName: {
                    type: "string"
                },
                password: {
                    type: "string"
                },
                sendAs: {
                    type: "string",
                    format: 'e164'
                },
                callerId: {
                    type: "string"
                }
            },
            required: ['userName', 'password', 'sendAs', 'callerId']
        }
    }
];

module.exports = Schemas;
