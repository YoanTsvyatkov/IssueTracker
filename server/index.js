import auth from "./routers/auth-controller.js";
import issues from "./routers/issue-controller.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import verifyToken from "./middlewares/veryfy-user.js";
import mongoose from "mongoose";

dotenv.config();  
const app = express();
app.use(express.json());
app.use(cors());

function initRouthers(path, routhers) {
  app.use(path, routhers);
}


initRouthers("/api/", [auth, issues]);
app.all("/*", (req, res) => {
  res.sendStatus(404);
});

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () =>{
    app.listen(process.env.PORT, () => {
      console.log(`Started server and made db connection`);
    });
});