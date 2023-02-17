const { user: userService, auth: authService, mailer: mailerService, token: tokenService, signalwire: signalwireService } = require("../services/");
const dbUtils = require('../utils/db')

module.exports = {
    async register(req, res, next) {
        try {
            const user = await dbUtils.ensureDatabaseTransaction(
                async (session) => {

                    const json = await signalwireService.createSubAccount(req.body.companyName)
                    const company = await userService.createCompany({...req.body, signalwireSid: json.sid, amount: 0.00  }, session);
                    
                    const user = await userService.createUser({
                        ...req.body,
                        companyId: company._id,
                        role: 'companyAdmin'
                    }, session)

                    return user
                }
            )
            
            await mailerService.sendConfirmationEmail(user[0].email, user[0]._id)
            
            return res.send(user)

        } catch (error) {
            next(error);
        }
    },
    async login(req, res, next){
        try{
            const user = await authService.loginUserWithEmailAndPassword(req.body.email, req.body.password);

            if(user.active !== true){
                throw new Error('You have not verified your account. Please check email and follow link.')
            }

            // Generate token
            const token = await tokenService.generateToken(user._id, user.companyId);

            // Save token
            await tokenService.saveToken(user._id, token);

            // Set cookie
            res.cookie('authToken', token)

            res.send({
                message: 'Login successful',
                token: token
            })

        } catch(err){
            next(err)
        }
    },

    async logout(req, res, next){
        try {
            if(req.cookies.authToken || req.body.authToken){
                const token = req.cookies.authToken || req.body.authToken

                const decodedToken = await tokenService.decodeToken(token)

                tokenService.invalidateToken(decodedToken.sub, token)

                res.clearCookie('authToken')

                return res.send({
                    message: 'Logged out successfully'
                })
            }

            throw new Error('authToken not provided')

        } catch (error) {
            next(new Error('Invalid token'))
        }
    }, 

    async verify(req, res, next){
        try{
            if(await userService.isValidUserId(req.params.userId) === false || await userService.isUserVerified(req.params.userId)) throw new Error('User not found or user is already verified')

            await userService.verifyUser(req.params.userId)

            res.send({
                message: 'User verified'
            })
        } catch(e){
            next(e)
        }
    }
};
