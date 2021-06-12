import auth from "./routers/auth-controller.js";
import issues from "./routers/issue-controller.js";
import project from "./routers/project-controller.js";
import user from "./routers/user-controller.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config();  
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

function initRouters(path, routhers) {
  app.use(path, routhers);
}

initRouters("/api/", [auth, issues, project,user]);

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