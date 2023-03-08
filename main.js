var express = require("express");
var logger = require("morgan");
var cors = require("cors");
require('dotenv').config()
require("./database/conn");

app = express();
const port = process.env.PORT || 4000
app.use(cors());
app.use(logger("dev"));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use("/user", require("./routes/userRoute"))
app.use("/ques", require("./routes/questionRoute"))

app.listen(port, () => {
  console.log(`server started on ${port}`);
});
