var express = require("express");
const userController = require("../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT");
var router = express.Router();

router
    .post("/signup", userController.signup)
    .patch("/profile", verifyJWT, userController.updateProfile)
    .get("/questions",verifyJWT, userController.question)
    // save or remove question from acc
    .get("/save-rem/:queID", verifyJWT, userController.saveRemoveQues)

module.exports = router;
