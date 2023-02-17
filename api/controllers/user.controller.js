const { user: userService, token: tokenService, mailer: mailerService, user } = require("../services");
const { pickInArray } = require('../utils/pick')

module.exports = {
    async createUser(req, res, next) {
        try {
            const temporaryPassword = Math.random().toString(36).slice(-8);

            const user = await userService.createUser({
                ...req.body,
                password: temporaryPassword,
                companyId: req.tokenDecoded.companyId
            });

            await mailerService.sendUserConfirmationEmail(user.email, user._id, temporaryPassword)

            res.send({
                message: "User created",
                user: user,
            });
            
        } catch (error) {
            next(error)
        }
    },

    async getUsers(req, res, next){
        try{
            const companyId = await userService.getCompanyId(req.tokenDecoded.sub)
            const users = await userService.getUsers(companyId)

            const subArray = pickInArray(users, ['firstName', 'lastName', 'email', '_id']);
            res.send(subArray)
        } catch(e){
            next(e)
        }
    },

    async deleteUser(req, res, next){
        try {
            const response = await userService.deleteUser(req.params.userId)
            
            if(response.deletedCount !== 1){
                throw new Error('Unable to find user')
            }

            res.send({message: 'User deleted successfully'})

        } catch(e){
            next(e)
        }
    },

    async patchUser(req, res, next){
        try {
            const user = await userService.editUser(req.params.userId, req.body)

            res.send({
                message: 'Successfully patched user'
            })
            
        } catch (error) {
            next(error)
        }
    },

    
};
