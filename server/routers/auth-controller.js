import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

const authController = Router();

const users = [];

authController.post("/login", (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.sendStatus(400);
  }

  const registeredUser = users.find((user) => user.email === req.body.email);

  if (!registeredUser) {
    return res.sendStatus(404).send();
  }

  const passwordValidation = bcrypt.compareSync(
    req.body.password,
    registeredUser.password
  );
  if (!passwordValidation) {
    return res.sendStatus(401).send();
  }

  const token = jwt.sign(
    { email: registeredUser.email, password: registeredUser.password },
    process.env.SECRET,
    { expiresIn: "24h" }
  );
  res.send({ token: token });
});

authController.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.sendStatus(400);
  }

  let encryptedPassword = bcrypt.hashSync(req.body.password);

  let user = {
    email: req.body.email,
    password: encryptedPassword,
  };

  if (users.find((user) => user.email === req.body.email)) {
    return res.status(400).send("Email address is already taken");
  }

  users.push(user);

  let token = jwt.sign(
    { email: user.email, password: user.password },
    process.env.SECRET,
    { expiresIn: "24h" }
  );
  res.send({ token: token });
});

export default authController;
