var express = require("express");
const questionController = require("../controllers/question.controller");
const authMiddleware = require("../middleware/auth.middleware");
var router = express.Router({ caseSensitive: true });

const l1router = express.Router({ caseSensitive: true })
    .get("/query", questionController.questionQuery)
    .get("/latest", questionController.latestQuestion)
    .get("/unanswred", questionController.unanswred)
    .get("/index", questionController.indexQuestions);

const l2router = express.Router({ caseSensitive: true })
    .post("/question", authMiddleware, questionController.newQuestion)
    .post("/answer", questionController.newAnswer);

const l3router = express.Router({ caseSensitive: true })
    .post("/question", questionController.voteQuestion)
    .post("/answer", questionController.voteAnswer);

router
    .use("/", l1router)
    .use("/new", l2router)
    .get("/get/:quesID", questionController.questionByID)

    //react
    .use("/vote", authMiddleware, l3router);

module.exports = router;