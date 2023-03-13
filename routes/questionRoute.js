var express = require("express");
const questionController = require("../controllers/questionController");
const verifyJWT = require("../middleware/verifyJWT");
var router = express.Router();

router
    .get("/", questionController.questionQuery)
    .get("/index", questionController.indexQuestions)
    .post("/new-question", verifyJWT, questionController.newQuestion)
    .post("/answer", questionController.newAnswer)
    .get("/latest", questionController.latestQuestion)
    .get("/unanswred", questionController.unanswred)
    .get("/que/:quesID", questionController.questionByID)

    //react
    .get("/vote/:queID", verifyJWT, questionController.voteQuestion)
    .get("/vote/:queID/:ansID", verifyJWT, questionController.voteAnswer)

module.exports = router;