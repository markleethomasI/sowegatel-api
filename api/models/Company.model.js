const Mongoose = require("mongoose");

const NumberSchema = new Mongoose.Schema(
    {
        number: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const sipEndPoint = new Mongoose.Schema({
    userName: {
        type: String
    },
    signalwireEndpointId: {
        type: String
    },
    type: {
        type: String
    }
})

const CompanySchema = new Mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
        },
        numbers: [NumberSchema],
        signalwireSid: {
            type: String
        },
        endPoints: [sipEndPoint]
    },
    {
        strictQuery: false,
    }
);

/**
 * Check if email is taken
 * @param {string} companyName - The user's email
 * @returns {Promise<boolean>}
 */
CompanySchema.statics.isCompanyNameTaken = async (companyName) => {
    const isTaken = await this.findOne({ companyName });

    return !!isTaken;
};

module.exports = new Mongoose.model("Company", CompanySchema);
