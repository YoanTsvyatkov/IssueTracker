import {Router} from 'express'
import  jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

const authController = Router()

const users = []

authController.post('/login', (req, res) => {

})


authController.post('/register', (req, res) => {
    if (!req.body.email || !req.body.password){
        res.sendStatus(400)
    }

    let encryptedPassword = bcrypt.hashSync(req.body.password, 10)
    let user = {
        email: encryptedPassword,
        password: encryptedPassword
    }
    users.push(user)

    let token = jwt.sign({email: user.email}, process.env.SECRET,  {expiresIn: '24h'})
    res.send({token: token});
})


export default authController
