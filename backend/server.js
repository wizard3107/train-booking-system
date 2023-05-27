// server.js
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const routes = require("./routes");
db_url = "mongodb+srv://ashishsingh9720:ashu8923@cluster0.ux9ql2q.mongodb.net/?retryWrites=true&w=majority";
const mongoose = require("mongoose");

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);

  next();
});
app.use(routes);
const connect = () => {
  return mongoose.connect(db_url);
}
// Start the server
app.listen(3000, async () => {
  try {
    await connect();
    console.log("Server is running on port 3000");
    console.log('connected to mongoose')
  }
  catch (err) {
    console.log(err.message)
  }
});
