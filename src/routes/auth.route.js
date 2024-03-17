const router = require("express").Router();
const authController = require("../controllers/auth.controller");

router
    .post("/signin", authController.signin)
    .get("/refresh", authController.refreshToken)
    .get("/logout", authController.logout)
    
module.exports = router;