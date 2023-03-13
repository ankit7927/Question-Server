var express = require("express");
const { verifyToken } = require("../extras/JWTHelper");
const userController = require("../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT");
var router = express.Router();

router
    .post("/signup", userController.signup)
    .patch("/profile", verifyToken, userController.updateProfile)
    .get("/questions",verifyJWT, userController.question)
    // save or remove question from acc
    .get("/save-rem/:queID", verifyToken, userController.saveRemoveQues)

module.exports = router;
