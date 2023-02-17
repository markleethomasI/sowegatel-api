const express = require('express');
const router = express.Router();

const middlewares = require('../middlewares')
const controllers = require('../controllers')

const cookieParser = require('cookie-parser');
const userController = require('../controllers/user.controller');

router.use(cookieParser())

// Routes past this point are only available to logged in users
router.use(middlewares.auth.isLoggedIn)
router.get('/', controllers.user.getUsers)

// Routes past this point are only available to companyAdmins
router.use(middlewares.auth.roleAuthentication('companyAdmin'))
router.post('/', middlewares.validation.validate('body', 'user'), controllers.user.createUser)
router.delete('/:userId', controllers.user.deleteUser)
router.patch('/:userId', middlewares.validation.validate('body', 'user'), userController.patchUser)

// 
router.post('/:userId/endpoints', controllers.sip.assignEndpointToUser)

router.use((error, req, res, next) => {
    return res.status(400).send({ error: error.message});
});

module.exports = router;