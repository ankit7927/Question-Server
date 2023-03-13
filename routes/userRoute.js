var express = require("express");
const { verifyToken } = require("../extras/JWTHelper");
const userController = require("../controllers/userController");
var router = express.Router();

router
    .post("/signup", userController.signup)
    .post("/signin", userController.signin)
    .patch("/profile", verifyToken, userController.updateProfile)
    .get("/questions", verifyToken, userController.question)
    // save or remove question from acc
    .get("/save-rem/:queID", verifyToken, userController.saveRemoveQues)

module.exports = router;
