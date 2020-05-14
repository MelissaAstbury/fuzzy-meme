const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const config = require("./config");

//Import Routes
const authRoute = require("./routes/auth");

// Connect to Database
mongoose.set("useCreateIndex", true);
mongoose
  .connect(
    `mongodb+srv://${config.user}:${config.password}@cluster-fuqu4.mongodb.net/auth?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("connected")
  )
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Connection Failed!", err);
  });

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());

//Routes
app.use("/auth", authRoute);

//How to listen to the server
app.listen(8000);
