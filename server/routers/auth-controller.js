import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/user.js"
import signToken from "../utils/jwt.js"

const authController = Router();

authController.post("/login", (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.sendStatus(400);
  }

  User.findOne({
    email: req.body.email
  })
    .then((user) => {
      if(!user){
        return res.sendStatus(404);
      }

      bcrypt.compare(req.body.password, user.password)
              .then(result => {
                  if (!result) {
                    return res.sendStatus(401).send();
                  }
                
                  const token = signToken(req.body.email, req.body.password, "24h")
                  res.send({ token: token });
              })
              .catch(err => {
                res.send(err);
              })
    }).catch((err) => {
      return res.status(500).json(err);
    });
});

authController.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.sendStatus(400);
  }

  User.findOne({ email: req.body.email })
    .then((user) => {
      if(user){
        return res.sendStatus(400);
      }

      bcrypt.hash(req.body.password, 10)
          .then(password => {

            const newUser = new User({
              email: req.body.email,
              password: password
            });
            
            newUser.save().then(() => {
                      const token = signToken(newUser.email, newUser.password, "24h");                
                      return res.send({ token: token });
            })
            .catch(err => res.send(err))
          })
          .catch(err => res.send(err));
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

export default authController;
