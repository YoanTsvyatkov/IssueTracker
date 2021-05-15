import { Router } from "express";
import verifyToken from "../middlewares/veryfy-user.js";
import Issue from "../models/issue.js";
import User from "../models/user.js";

const issueController = Router();

const issues = [];

issueController.post("/issue", verifyToken, (req, res) => {
  if (
    !req.body.title ||
    !req.body.priority
  ) {
    return res.sendStatus(400);
  }

  const issueDocument = {
    title: req.body.title,
    description: req.body.description || "",
    priority: req.body.priority,
    assignee: req.body.assignee || {}
  }

  const issue = new Issue(issueDocument)

  issue.save()
    .then(() => {
      res.status(201).send(issueDocument)
    })
    .catch(err => {
      res.status(500).send(err);
    })
});

issueController.put("/issue/:id", verifyToken, (req, res) => {
  const possition = checkIfIssueExist(req.params.id);
  if (possition == -1) {
    res.sendStatus(400);
  }

  issues[possition].title = req.body.title;
  issues[possition].assignee = req.body.assignee;
  issues[possition].priority = req.body.priority;
  res.send(issues[possition]);
});

issueController.get("/issue", verifyToken, (req, res) => {
  res.send(issues);
});

issueController.get("/issue/:id", verifyToken, (req, res) => {
  const possition = checkIfIssueExist(req.params.id);
  if (possition != -1) {
    res.send(issues[possition]);
  } else {
    res.sendStatus(400);
  }
});

issueController.delete("/issue/:id", verifyToken, (req, res) => {
  const possition = checkIfIssueExist(req.params.id);
  if (possition != -1) {
    issues.splice(possition, 1);
    res.send(issues);
  } else {
    res.sendStatus(400);
  }
});

function checkIfIssueExist(id) {
  for (let possition = 0; possition < issues.length; possition++) {
    if (issues[possition].id == id) {
      return possition;
    }
  }
  return -1;
}

export default issueController;
