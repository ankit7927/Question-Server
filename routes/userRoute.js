var express = require("express");
const { verifyToken } = require("../extras/JWTHelper");
const userController = require("../controllers/userController");
var router = express.Router();

router
    .post("/signup", userController.signup)
    .post("/signin", userController.signin)
    .patch("/profile", verifyToken, userController.updateProfile)
    .get("/question", verifyToken, userController.question)

module.exports = router;
