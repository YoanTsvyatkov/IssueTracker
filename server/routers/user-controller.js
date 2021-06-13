import express from "express";
import verifyToken from "../middlewares/verify-token.js";
import User from "../models/user.js";

const {Router} = express;
const userController = Router();

userController.get('/user', verifyToken, (req, res) => {
    User.find({})
        .then((users) => {
            res.send(users);
        })
        .catch((err) => {
            res.sendStatus(500);
        })
})

export default userController;