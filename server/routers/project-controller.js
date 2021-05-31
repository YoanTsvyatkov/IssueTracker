import express from "express";
import verifyToken from "../middlewares/verify-token.js";
import Project from "../models/project.js";
import upload from "../utils/multer.js";
import fs from "fs";
import path from "path";

const {Router} = express;

const projectController = Router();

projectController.post("/project", verifyToken, upload.single("image"), (req, res) => {
  const name = req.body.projectName;
  const fileName = req.file.filename;
  const statuses = req.body.statuses || [];

  if(!name || !fileName){
    return res.sendStatus(400);
  }

  fs.readFile(path.join(path.resolve(), '/uploads/', fileName), (err, data) =>{
      if(err){
        return res.status(400).send(err);
      }

      const project = Project();

      project.projectName = name;
      project.statuses = statuses;
      project.image.data = data;
      project.image.contentType = 'image/png';

      project.save()
        .then(() => {
          return res.status(201).send(project);
        })
        .catch(err => {
         return res.status(500).send(err);
        })
    })
});

projectController.put("/project/:id", verifyToken,  upload.single("image"), (req, res) => {
    let fileName;
    if(req.file){
      fileName = req.file.filename;
    }

    const projectName = req.body.projectName;
    const statuses = req.body.statuses || null;

    Project.findById(
      { 
        _id : req.params.id
      }, 
    ).then(project => {
        if(!project){
          return res.sendStatus(404);
        }

        if(projectName){
          project.projectName = req.body.projectName;
        }

        if(statuses){
          project.statuses = statuses;
        }

        if(!fileName){
          project.save()
            .then(() => {
              return res.status(200).send(project);
            })
            .catch(err => {
             return res.sendStatus(500);
            });
        }else{
          fs.readFile(path.join(path.resolve(), '/uploads/', fileName), (err, data) =>{
            if(err){
              return res.status(400).send(err);
            }
  
            project.image.data = data;
            project.image.contentType = 'image/png';
      
            project.save()
              .then(() => {
                return res.status(201).send(project);
              })
              .catch(err => {
               return res.status(500).send(err);
              })
          })
        }
    })
     .catch(err => {
        return res.status(500).send(err); 
    });
});


projectController.get("/project", verifyToken, (req, res) => {
  Project.find({})
      .then(projects  => {
        res.send(projects);
      })
      .catch(err => {
        res.status(500).send(err);
      })
});

projectController.delete('/project/:id', verifyToken, (req, res) => {
  Project.findByIdAndDelete(req.params.id)
    .then(project => {
      if(!project){
        return  res.statusCode(404);
      }

      return res.send(project);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

export default projectController;
