const { user: userService, debit: debitService, auth: authService, mailer: mailerService, token: tokenService } = require("../services/");

const credit = async (req, res, next) => {
    try {
        const creditResponse = await debitService.creditAccount(req.tokenDecoded.companyId, req.body.amount)
        
        res.send({
            message: 'Added $' + req.body.amount + " to account"
        })

    } catch (error) {
        next(error)
    }
}

module.exports = { credit }