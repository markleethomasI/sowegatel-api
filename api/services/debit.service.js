const { Company } = require('../models')

const creditAccount = async (companyId, amount) => {
    const company = await Company.findOne({_id: companyId});
    company.amount = Number(company.amount) + Number(amount)

    return company.save();
}

const debitAccount = async (companyId, amount) => {
    const company = await Company.findOne({_id: companyId});
    company.amount = Number(company.amount) - Number(amount)

    return company.save();
}

module.exports = { creditAccount, debitAccount }