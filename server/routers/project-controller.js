import express from "express";
import verifyToken from "../middlewares/verify-token.js";
import Project from "../models/project.js";
import upload from "../utils/multer.js";
import ProjectDto from "../dtos/project-dto.js"
import fs from "fs";
import path from "path";

const {Router} = express;

const projectController = Router();

projectController.post("/project", verifyToken, upload.single("image"), (req, res) => {
  const name = req.body.projectName;
  let fileName;

  if(req.file){
      fileName = req.file.filename;
  }
  
  const statuses = req.body.statuses || [];

  if(!name || !fileName){
    return res.sendStatus(400);
  }

  fs.readFile(path.join(path.resolve(), '/uploads/', fileName), (err, data) =>{
      if(err){
        return res.sendStatus(400);
      }

      const project = Project();

      project.projectName = name;
      project.statuses = statuses;
      project.image.data = data;
      project.image.contentType = req.file.mimetype;

      project.save()
        .then(() => {
          const projectDto = new ProjectDto(project, project.image.contentType);
          return res.status(201).send(JSON.stringify(projectDto));
        })
        .catch(err => {
         return res.sendStatus(500);
        })
    })
});

projectController.put("/project/:id", verifyToken,  upload.single("image"), (req, res) => {
    if(!req.body.projectName && !req.body.statuses && !req.file){
      return res.sendStatus(400);
    }
    
    let fileName;
    if(req.file){
      fileName = req.file.filename;
    }

    const projectName = req.body.projectName || null;
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
          project.projectName = projectName;
        }

        if(statuses){
          project.statuses = statuses;
        }

        if(!fileName){
          project.save()
            .then(() => {
              const projectDto = new ProjectDto(project, project.image.contentType);
              return res.status(200).send(JSON.stringify(projectDto));
            })
            .catch(err => {
             return res.sendStatus(500);
            });
        }else{
          fs.readFile(path.join(path.resolve(), '/uploads/', fileName), (err, data) =>{
            if(err){
              return res.sendStatus(400);
            }
  
            project.image.data = data;
            project.image.contentType = 'image/png';
      
            project.save()
              .then(() => {
                const projectDto = new ProjectDto(project, req.file.mimetype)
                return res.status(200).send(JSON.stringify(projectDto));
              })
              .catch(err => {
               return res.sendStatus(500);
              })
          })
        }
    })
     .catch(err => {
        return res.sendStatus(500); 
    });
});


projectController.get("/project", verifyToken, async (req, res) => {
  try{
    const list = await Project.find({})
    const result = list.map(project => {
              return new ProjectDto(project, project.image.contentType);
    });
    
    res.send(result);
  }catch(err){
    res.sendStatus(500);
  }
});

projectController.delete('/project/:id', verifyToken, (req, res) => {
  Project.findByIdAndDelete(req.params.id)
    .then(project => {
      if(!project){
        return  res.sendStatus(404);
      }

      return res.send(project);
    })
    .catch(err => {
      res.sendStatus(500);
    });
});

export default projectController;
