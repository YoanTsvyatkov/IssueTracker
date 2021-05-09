import { Router } from "express";
import verifyToken from "../middlewares/veryfy-user.js";

const issueController = Router();

const issues = [];

issueController.post("/issue", verifyToken, (req, res) => {
  if (
    !req.body.title ||
    !req.body.assignee ||
    !req.body.priority ||
    !req.body.id
  ) {
    return res.sendStatus(400);
  }

  const issue = {
    id: req.body.id,
    title: req.body.title,
    assignee: req.body.assignee,
    priority: req.body.priority,
  };

  issues.push(issue);

  res.send(issue);
});

issueController.put("/update-issue/:id", (req, res) => {
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

issueController.delete("/delete-issue/:id", verifyToken, (req, res) => {
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
