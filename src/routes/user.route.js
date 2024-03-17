const router = require("express").Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");


router
    .post("/signup", userController.signup)
    .patch("/profile", authMiddleware, userController.updateProfile)
    .get("/questions",authMiddleware, userController.question)
    // save or remove question from acc
    .get("/save-rem/:queID", authMiddleware, userController.saveORremoveQuestion)

module.exports = router;
