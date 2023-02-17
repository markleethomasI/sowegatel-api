const User = require("../models/User.model");
const Company = require("../models/Company.model");

module.exports = {
    /**
     * Create a user
     * @param {Object} userBody
     * @returns {Promise<User>}
     */
    async createUser(userBody, session) {
        if (await this.isEmailTaken(userBody.email)) {
            throw new Error("Email is taken");
        }

        if (session) {
            return User.create([userBody], { session });
        }

        return User.create(userBody);
    },

    deleteUser(userId) {
        return User.deleteOne({
            _id: userId,
        });
    },

    /**
     * Create a company
     * @param {Object} userBody
     * @returns {Promise<Company>}
     */
    async createCompany(userBody, session) {
        if (await this.isCompanyNameTaken(userBody.companyName)) {
            throw new Error("Company name is taken");
        }

        if (session) {
            const company = await Company.create([userBody], { session });
            return company[0];
        }

        const company = await Company.create(userBody);

        return company;
    },
    /**
     * Find a user by id
     * @param {String} id
     * @returns {Promise<User>}
     */
    async findUserById(id) {
        return User.findById(id);
    },

    /**
     * @param {String} userId
     * @returns {String}
     */

    async getUserRole(userId) {
        const user = await this.findUserById(userId);
        return user.role;
    },

    /**
     * Check to see if email address is taken
     * @param {String} email
     * @returns {Promise<boolean>}
     */
    async isEmailTaken(email) {
        const isTaken = await User.findOne({ email: email });

        return !!isTaken;
    },
    /**
     * Check to see if company name is taken
     * @param {String} companyName
     * @returns {Promise<boolean>}
     */
    async isCompanyNameTaken(companyName) {
        const isTaken = await Company.findOne({ companyName });

        return !!isTaken;
    },

    /**
     *
     * @param {String} userId
     * @returns {boolean}
     */
    async isUserVerified(userId) {
        const user = await User.findById(userId);
        return user.active === true;
    },

    /**
     * Get user by email
     * @param {String} Email
     * @returns {Promise<User>}
     */
    async getUserByEmail(email) {
        return User.findOne({ email });
    },

    /**
     * verifyUser changes active status in database
     * @param {String} userId
     */
    async verifyUser(userId) {
        const user = await User.findById(userId);

        user.active = true;

        await user.save();
    },

    /**
     *
     * @param {String} companyId
     * @returns {Promise<User[]>}
     */
    async getUsers(companyId) {
        return User.find({ companyId }).lean();
    },

    /**
     *
     * @param {String} userId
     * @returns {String<companyId>}
     */
    async getCompanyId(userId) {
        const user = await User.findById(userId);

        return user.companyId;
    },

    /**
     * Checks if user id is valid and returns true or false
     * @param {String} userId
     * @returns {boolean}
     */
    async isValidUserId(userId) {
        const user = await User.findById(userId);

        return user ? true : false;
    },

    async editUser(userId, userObject) {
        const user = await User.findById(userId);

        for (let key in userObject) {
            user[key] = userObject[key];
        }

        return user.save();
    },

    /**
     * 
     * @param {*} companyId 
     * @returns signalwireSid
     */
    async getSignalwireSid (companyId) {
        const company = await Company.findById(companyId)

        return company.signalwireSid;
    },


    /**
     * Assigns endpoint to user account
     * @param {*} userId 
     * @param {*} endpointId 
     * @param {*} endpointName 
     * @param {*} endpointType 
     */
    async addEndPointToUser (userId, endpointId, endpointName, endpointType) {
        const user = await userService.findById(userId)
        
        if(!user){
            throw new Error('Unable to find user.')
        }

        user.endPoints.push({
            endpointName,
            endpointType,
            endpointId
        })

        await user.save()
    }

};
