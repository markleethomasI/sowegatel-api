const express = require("express");
const router = express.Router();

const middleware = require("../middlewares");
const controllers = require("../controllers/");
const cookieParser = require("cookie-parser")

router.use(cookieParser())

router.post("/register", middleware.validation.validate('body', 'register'), controllers.auth.register);

router.get("/verify/:userId", controllers.auth.verify);

router.post("/login", middleware.validation.validate('body', 'login'), controllers.auth.login);

// loggedIn route guard protected routes

router.use(middleware.auth.isLoggedIn)
router.post("/logout", controllers.auth.logout)



router.use((error, req, res, next) => {
    return res.status(400).send({ error: error.message });
});

module.exports = router;
