const mongoose = require("mongoose")

const remoteDB = `mongodb+srv://Ankit:${process.env.DBPASS}@electiondb.nxv1f0v.mongodb.net/?retryWrites=true&w=majority`
const localDB = "mongodb://localhost:27017/question";

mongoose.set("strictQuery", false)
mongoose.connect(localDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("connected to database ")
}).catch((err) => console.log("failed to connect database " + "\n" + err))





