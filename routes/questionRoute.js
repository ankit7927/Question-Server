var express = require("express");
const questionSchema = require("../database/schemas/questionSchema");
const tagSchema = require("../database/schemas/tagSchema");
const userSchema = require("../database/schemas/userSchema");
const { verifyToken } = require("../extras/JWTHelper");
var router = express.Router();



/**
 * create new question...
 * collect tags and update in db.
 */
router.post("/new-question", verifyToken, async (req, res) => {
    try {
        const id = req.user._id
        const { title, content, tags } = req.body;

        const user = await userSchema.findOne({ _id: id })

        const xtags = tags.split(",")
        const newQuestion = new questionSchema({
            "question.title": title,
            "question.content": content,
            name: user.name,
            tags: xtags
        })

        newQuestion.save().then(data => {
            user.question.asked.push(data._id)

            user.save()

            tagSchema.updateMany({},
                {
                    $push: {
                        tags: xtags
                    }
                }).catch(err => console.log(err))

            return res.send("ok")

        }).catch(err => { return res.status(500).send(err); })
    } catch (error) {
        return res.status(500).send(error)
    }
})

router.post("/answer", async (req, res) => {
    try {
        const { answer, email, name, quesID } = req.body
        const user = await userSchema.findOne({ email: email })

        questionSchema.findByIdAndUpdate(
            { _id: quesID },
            {
                "$push": {
                    answers: {
                        answer: answer,
                        email: email,
                        name: name
                    }
                }
            }, { new: true }).then(data => {
                user?.question.answerd.push(data._id)
                user?.save()
                res.status(201).send(data);
            }).catch(err => { return res.status(500).send(err); })
    } catch (error) {
        return res.status(500).send(error)
    }
})

router.get("/que/:queID", (req, res) => {

    questionSchema.findById({ _id: req.params.queID })
        .then(data => {
            questionSchema.findByIdAndUpdate({ _id: data._id },
                {
                    $set: {
                        views: data.views + 1
                    }
                }, { new: true }).then(updated => {
                    return res.send(updated)
                }).catch(err => { return res.status(500).send(err); })
        }).catch(err => { return res.status(500).send(err); })
})

/**
 * search question on query
 */
router.get("/", (req, res) => {
    const query = req.query.question;
    questionSchema.find(
        {
            "$or": [
                {
                    "question": {
                        $regex: query
                    }
                },
                {
                    "tags": {
                        $regex: query
                    }
                }
            ]
        }, { question: 1, createdAt: 1, email: 1, votes: 1 }, { limit: 18 })
        .then(data => { res.send(data) })
        .catch(err => { return res.status(500).send(err); })
})


router.get("/latest", async (req, res) => {
    const latestQuestions = await questionSchema.find()
        .select('question votes createdAt name')
        .sort({ createdAt: -1 })
        .limit(15);

    return res.send(latestQuestions)
})

router.get("/ananswred", async (req, res) => {
    const unansweredQuestions = await questionSchema.find({ answers: { $eq: [] } })
        .select('question votes createdAt name')
        .limit(20)
        .sort({ createdAt: -1 });

    res.send(unansweredQuestions);

})

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

/**
 * get questions for home page new, poplure, not answerd
 * new question have range of one month from now..
 * and pic those question which not answerd any more..
 * poploure questions will have higher votes
 */
router.get("/index", async (req, res) => {
    try {
        const result = {}

        result.latest = await questionSchema.find()
            .select('question')
            .sort({ createdAt: -1 })
            .limit(15);

        result.trending = await questionSchema.find()
            .select('question votes createdAt name')
            .sort({ views: -1, answers: -1 })
            .limit(10);

        return res.send(result)
    } catch (error) {
        return res.status(500).send(error)
    }
})

router.get("/vote/:queID", verifyToken, async (req, res) => {
    try {
        const quesID = req.params.queID

        const question = await questionSchema.findOne({ _id: quesID })
            .select("votes");
        if (!question) {
            return res.status(500).send('Question not found');
        }
        const user = await userSchema.findOne({ _id: req.user._id })
            .select("question");
        if (!user) {
            return res.status(500).send('User not found');
        }

        if (user.question.voted.questions.includes(quesID)) {
            user.question.voted.questions.pull(quesID)
            question.votes = question.votes - 1
        } else {
            user.question.voted.questions.push(quesID)
            question.votes = question.votes + 1
        }

        await user.save()
        await question.save()

        return res.send(question.votes.toString())
    } catch (error) {
        return res.status(500).send(error)
    }
})

router.get("/vote/:queID/:ansID", verifyToken, async (req, res) => {
    try {
        const quesID = req.params.queID
        const ansID = req.params.ansID
        const question = await questionSchema.findOne({ _id: quesID })
            .select("answers");

        if (!question) return res.status(500).send('Question not found');

        const user = await userSchema.findOne({ _id: req.user._id })
            .select("question");

        if (!user) return res.status(500).send('User not found');

        const x = question.answers.find(item => item._id == ansID) 

        if (user.question.voted.answers.includes(ansID)) {
            user.question.voted.answers.pull(ansID)
            x.votes = x.votes - 1
        } else {
            user.question.voted.answers.push(ansID)
            x.votes = x.votes + 1
        }

        await user.save()
        await question.save()

        return res.send(question)
    } catch (error) {
        console.log(error);
        return res.status(500).send(error)
    }
})

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

router.post("/get-list", verifyToken, (req, res)=>{
    try{
        const idList = req.body.idList;
        
        questionSchema.find({_id: {$in:idList}})
        .select("question votes createdAt")
        .then(data => { res.send(data) })
        .catch(err => { return res.status(500).send(err); })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error)
    }
})

module.exports = router;