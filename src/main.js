require('dotenv').config()
var express = require("express");
var logger = require("morgan");
var cors = require("cors");
const { default: mongoose } = require('mongoose');
var cookieParser = require("cookie-parser")
const corsOptions = require("./utility/corsOptions");
const connectDB = require('./config/db.config');


console.log(process.env.NODE_ENV);

app = express();

if (process.env.NODE_ENV == "dev") app.use(logger("dev"));

app.use(cors(corsOptions));
app.use(cookieParser())
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({ message: err.message })
});

connectDB()

app.use("/user", require("./routes/user.route"))
app.use("/ques", require("./routes/question.route"))
app.use("/auth", require("./routes/auth.route"))

mongoose.connection.once("open", () => {
  console.log("connected to database");
  const port = process.env.PORT || 4000
  app.listen(port, () => {
    console.log(`server started on ${port}`);
  });
})

mongoose.connection.on("error", (error) => {
  console.log(error);
})
