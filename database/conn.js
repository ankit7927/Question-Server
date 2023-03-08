const mongoose = require("mongoose")

const remoteDB = process.env.REMOTE_DATABASE_URL || ""
const localDB = "mongodb://127.0.0.1:27017/questionDB";

mongoose.set("strictQuery", false)
main().then(()=>{
    console.log("conncted to database");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(remoteDB);
}