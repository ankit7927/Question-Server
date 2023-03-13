var express = require("express");
const authController = require("../controllers/authController");

var router = express.Router();

router
    .post("/signin", authController.signin)
    .get("/refresh", authController.refreshToken)
    .post("/logout", authController.logout)
    
module.exports = router;