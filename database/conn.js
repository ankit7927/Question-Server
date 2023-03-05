const mongoose = require("mongoose")

const remoteDB = `mongodb+srv://Ankit:${process.env.DBPASS}@electiondb.nxv1f0v.mongodb.net/?retryWrites=true&w=majority`
const localDB = "mongodb://127.0.0.1:27017/questionDB";

/*
mongoose.set("strictQuery", false)
mongoose.connect(localDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("connected to database ")
}).catch((err) => console.log("failed to connect database " + "\n" + err))
*/

mongoose.set("strictQuery", false)
main().then(()=>{
    console.log("conncted to database");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(localDB);
}




