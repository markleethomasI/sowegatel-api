const signalwireService = require('../services/signalwire.service')
const userService = require('../services/user.service')
const numbersService = require('../services/numbers.service')

/**
 * Provides available numbers
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const availableNumbers = async (req, res, next) => {
    try{
        const availableNumbers = await signalwireService.getAvailablePhoneNumbers(req.body.areaCode)
        res.send(availableNumbers)
    }catch(e){
        next(e)
    }
}


const buyNumber = async(req, res, next) => {
    try{
        const companyId = req.tokenDecoded.companyId

        // Get signalwireSid 
        const signalwireSid = await userService.getSignalwireSid(companyId)

        const json = await signalwireService.buyAvailablePhoneNumber(req.body.number, signalwireSid);
        await numbersService.addNumberToCompany(req.body.number, companyId)
        
        res.send({message: 'Number: ' + req.body.number + ' purchased successfully'})

    } catch(e){
        next(e)
    }
}

const getNumbers = async (req, res, next) => {
    try {
        const numbersArray = await numbersService.getNumbers(req.tokenDecoded.companyId)
        res.send(numbersArray)
    } catch (error) {
        next(error)
    }

}

module.exports = { availableNumbers, buyNumber, getNumbers }