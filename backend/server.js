// server.js
const express = require("express");
const app = express();
const cors = require("cors")
const bodyParser = require("body-parser");
const routes = require("./routes");
db_url = "mongodb+srv://ashishsingh9720:ashu8923@cluster0.ux9ql2q.mongodb.net/?retryWrites=true&w=majority";
const mongoose = require("mongoose");

app.use(express.json());
app.use(cors());
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
