const express = require("express");
const app = express();

const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const routes = require("./routes/index");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const port = process.env.PORT || 3001;
dotenv.config();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
routes(app);

mongoose
  .connect(
    `mongodb+srv://ngoctan:${process.env.MONGO_DB}@ngoctan.oyh0rog.mongodb.net/?retryWrites=true&w=majority&appName=NgocTan`
  )
  .then(() => {
    console.log("Connect Db success!");
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(port, () => {
  console.log("Server is running in port", port);
});
