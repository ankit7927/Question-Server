var express = require("express");
const questionController = require("../controllers/questionController");
const { verifyToken } = require("../extras/JWTHelper");
var router = express.Router();

router
    .get("/", questionController.questionQuery)
    .get("/index", questionController.indexQuestions)
    .post("/new-question", verifyToken, questionController.newQuestion)
    .post("/answer", questionController.newAnswer)
    .get("/latest", questionController.latestQuestion)
    .get("/unanswred", questionController.unanswred)
    .get("/que/:quesID", questionController.questionByID)

    //react
    .get("/vote/:queID", verifyToken, questionController.voteQuestion)
    .get("/vote/:queID/:ansID", verifyToken, questionController.voteAnswer)

module.exports = router;