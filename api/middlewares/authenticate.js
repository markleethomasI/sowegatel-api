const { token: tokenService, user: userService } = require('../services')

module.exports = {
    roleAuthentication: (role) => async (req, res, next) => {
        if(req.body.authToken || req.cookies.authToken){
            const token = req.body.authToken || req.cookies.authToken
            const decodedToken = await tokenService.decodeToken(token)
            const userRole = await userService.getUserRole(decodedToken.sub)
            
            if(role !== userRole) {
                return next(new Error(`You don't have permissions to access this resource`))
            }
            
            return next()
        }

        next(new Error('You are not logged in'))
    },

    async isLoggedIn(req, res, next){
        if(req.body.authToken || req.cookies.authToken){
            const token = req.body.authToken || req.cookies.authToken

            if(await tokenService.verifyToken(token)){

                req.tokenDecoded = await tokenService.decodeToken(token)

                return next()
            }

            return next(new Error('You are not logged in'))
        }

        next(new Error('You are not logged in'))
    }
}