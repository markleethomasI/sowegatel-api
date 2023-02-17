const express = require("express");
const router = express.Router();

const middleware = require("../middlewares");
const controllers = require("../controllers/");
const cookieParser = require("cookie-parser")

router.use(cookieParser())

router.use(middleware.auth.isLoggedIn)
router.use(middleware.auth.roleAuthentication('companyAdmin'))

router.get('/available', controllers.numbers.availableNumbers)

router.post('/buy', controllers.numbers.buyNumber)

router.get('/', controllers.numbers.getNumbers)

router.use((error, req, res, next) => {
    return res.status(400).send({ error: error.message});
});

module.exports = router