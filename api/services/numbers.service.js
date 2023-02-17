const Company = require("../models/Company.model");
const dbHelpers = require("../utils/db");

const addNumberToCompany = async (number, companyId) => {
    const isObjectId = await dbHelpers.isObjectId(companyId);

    if (!isObjectId) {
        throw new Error("Not a valid object Id");
    }

    const company = await Company.findById(companyId);

    if (!company) {
        throw new Error("Company cannot be found");
    }

    company.numbers.push({
        number,
    });

    await company.save();
};

/**
 * Retrieves numbers associated with company
 * @param {*} companyId
 * @returns {Number[]}
 */
const getNumbers = async (companyId) => {
    const company = await Company.findById(companyId);

    return company.numbers;
};

module.exports = { addNumberToCompany, getNumbers };
