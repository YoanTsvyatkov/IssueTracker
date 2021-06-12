import express from "express";
import verifyToken from "../middlewares/verify-token.js";
import Issue from "../models/issue.js";

const { Router } = express;

const issueController = Router();

issueController.post("/issue", verifyToken, (req, res) => {
  if (
    !req.body.title ||
    !req.body.priority ||
    !req.body.status ||
    !req.body.projectId
  ) {
    return res.sendStatus(400);
  }

  const issueDocument = {
    status: req.body.status,
    title: req.body.title,
    description: req.body.description || "",
    priority: req.body.priority,
    assignee: req.body.assignee || {},
    projectId: req.body.projectId
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
  Issue.findByIdAndUpdate(
    { 
      _id : req.params.id
    }, 
      req.body,
    { 
      new: true, 
      runValidators: true
    }
  ).then(issue => {
      if(!issue){
        return res.sendStatus(404);
      }

      return res.send(issue);
   }
   ).catch(err => {
      res.status(500).send(err); 
   });
});

issueController.get("/issue/:projectId", verifyToken, (req, res) => {
  Issue.find({
    projectId: req.params.projectId
  })
      .then(issues  => {
        res.send(issues);
      })
      .catch(err => {
        res.status(500).send(err);
      })
});

issueController.get("/issue/:id", verifyToken, (req, res) => {
  Issue.findById(req.params.id)
    .then(issue => {
      if(!issue){
        return res.sendStatus(404);
      }

      return res.send(issue);
    })
    .catch(err => {
      return res.status(500).send(err);
    })
});

issueController.delete("/issue/:id", verifyToken, (req, res) => {
    Issue.findByIdAndDelete(
      req.params.id
    ).then(issue => {
      if(!issue){
        return res.sendStatus(404);
      }

      return res.send(issue);
    }).catch(err => {
      return res.status(500).send(err);
    });
});

export default issueController;
