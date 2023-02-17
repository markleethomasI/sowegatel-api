const { Token, User } = require("../models");
const jwt = require("jsonwebtoken");

const secret = process.env.TOKEN_SECRET;
const userExpirationTime = process.env.USER_JWT_EXPIRATION_TIME;

module.exports = {
    /**
     * Generate token
     * @param {ObjectId} userId
     * @param {Moment} expires
     * @returns {string}
     */

    async generateToken(userId, companyId) {
        const payload = {
            sub: userId,
            companyId: companyId
        };
        return jwt.sign(payload, secret, { expiresIn: userExpirationTime });
    },

    /**
     * Verify token
     * @param {Token} token
     * @returns {boolean}
     */

    async verifyToken(token) {
        try {
            const tokenDecoded = await jwt.verify(token, secret);

            const user = await User.findOne({ "tokens.token": token });

            return user ? true : false;
        } catch (e) {
            return false;
        }
    },

    /**
     * Invalidate token
     * @param {String} userId
     * @param {String} token
     * @returns
     */

    async invalidateToken(userId, token) {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        user.tokens = user.tokens.filter((tokenDoc) => {
            return tokenDoc.token !== token;
        });

        await user.save();

        return true;
    },

    /**
     * Save Token
     * @param {ObjectId} userId
     * @param {Token} token
     * @returns {User}
     */

    async saveToken(userId, token) {
        // Find user
        const user = await User.findOne({ _id: userId });

        user.tokens.push(new Token({ token }));

        await user.save();

        return user;
    },

    /**
     * Decode token
     * @param {String} token 
     * @returns {Object}
     */
    async decodeToken(token) {
        const tokenDecoded = await jwt.verify(token, secret);

        return tokenDecoded;
    },
};
