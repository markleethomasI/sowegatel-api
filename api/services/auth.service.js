const userService = require('./user.service')

module.exports = {

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
async loginUserWithEmailAndPassword(email, password){
    const user = await userService.getUserByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
      throw new Error('Username or password invalid')
    }
    return user;
  },


}