const Company = require('../models/Company.model')

const addEndPoint = async (companyId, userName, endpointId, type) => {
    const company = await Company.findById(companyId)

    company.endPoints.push({
        userName: userName,
        signalwireEndpointId: endpointId,
        type
    })

    await company.save();

}

module.exports = { addEndPoint }