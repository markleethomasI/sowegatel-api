const signalwireService = require('../services/signalwire.service')
const userService = require('../services/user.service')
const numbersService = require('../services/numbers.service')
const endpointService = require('../services/endpoint.service')

const createSipEndpoint = async (req, res, next) => {
    try {
        const signalWireSid = await userService.getSignalwireSid(req.tokenDecoded.companyId)

        const json = await signalwireService.createSipEndpoint(req.body.userName, req.body.password, req.body.sendAs, req.body.callerId, signalWireSid)
    
        await endpointService.addEndPoint(req.tokenDecoded.companyId, req.body.userName, json.id, json.type)

        res.send({message: `Created endpoint: ${req.body.userName}`})
    
    } catch (error) {
        next(error)
    }

}

const getSipEndpoints = async (req, res, next) => {
    try{
        const signalWireSid = await userService.getSignalwireSid(req.tokenDecoded.companyId)

        const json = await signalwireService.getSipEndpoints(signalWireSid)

        res.send(json)
    }catch(e){
        next(e)
    }
}

const assignEndpointToUser = async (req, res, next) => {
try {
    const signalWireSid = await userService.getSignalwireSid(req.tokenDecoded.companyId)

    await userService.addEndPointToUser(req.tokenDecoded.sub, req.body.endpointId, req.body.endPointName, req.body.endpointType)
} catch (error) {
    next(error)
}
}

module.exports = { createSipEndpoint, getSipEndpoints, assignEndpointToUser }