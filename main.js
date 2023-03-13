require('dotenv').config()
var express = require("express");
var logger = require("morgan");
var cors = require("cors");
var cookieParser = require("cookie-parser")
const corsOptions = require("./config/corsOptions");
const connectDB = require('./database/conn');
const { default: mongoose } = require('mongoose');

console.log(process.env.NODE_ENV);

app = express();
const port = process.env.PORT || 4000
app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(cookieParser())
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

connectDB()

app.use("/user", require("./routes/userRoute"))
app.use("/ques", require("./routes/questionRoute"))
app.use("/auth", require("./routes/authRoute"))

mongoose.connection.once("open", () => {
  console.log("connected to database");
  app.listen(port, () => {
    console.log(`server started on ${port}`);
  });
})

mongoose.connection.on("error", (error) => {
  console.log(error);
})
