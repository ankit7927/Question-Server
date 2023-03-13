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

/*

router.get('/trending', async (req, res) => {
    try {
        const trendingQuestions = await Question.aggregate([
            {
                $project: {
                    _id: 1,
                    title: 1,
                    votes: { $size: "$votes" }
                }
            },
            {
                $sort: { votes: -1 }
            },
            {
                $limit: 10 // Returns only the top 10 trending questions
            }
        ]);

        res.send(trendingQuestions);
    } catch (error) {
        return res.status(500).send(error)
    }
});

router.get("/save/:queID", verifyToken, async (req, res)=>{
    try{
        const quesID = req.params.queID;
        const user = await userSchema.findOne({ _id: req.user._id })
            .select("question");

        if (!user) return res.status(500).send('User not found');

        if (!user.question.saved.includes(quesID)) {
            user.question.saved.push(quesID)
        } 

        await user.save()

        return res.send("ok")
    }catch (error) {
        console.log(error);
        return res.status(500).send(error)
    }
})

router.delete("/save/:queID", verifyToken, async (req, res)=>{
    try{
        const quesID = req.params.queID;
        const user = await userSchema.findOne({ _id: req.user._id })
            .select("question");

        if (!user) return res.status(500).send('User not found');

        if (user.question.saved.includes(quesID)) {
            user.question.saved.pull(quesID)
        } 

        await user.save()

        return res.send(user.question)
    }catch (error) {
        console.log(error);
        return res.status(500).send(error)
    }
})

*/
module.exports = router;