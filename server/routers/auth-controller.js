import {Router} from 'express'

const authController = Router()

authController.post('/login', (req, res) => {
    res.send("Successfull login")
})

export default authController
