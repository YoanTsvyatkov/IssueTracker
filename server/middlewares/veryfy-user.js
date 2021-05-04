import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'


function verifyToken(req, res, next){ 
    if (!req.headers.authorization || req.headers.authorization.split(' ').length <= 1 || 
        req.headers.authorization.split(' ')[0] != 'Bearer'){
        return res.sendStatus(401)
    }

    let token = req.headers.authorization.split(' ').pop()

    jwt.verify(token, process.env.SECRET, (error, user) => {
        if(error){
            return res.sendStatus(403)
        }

        req.user = user
        next()
    })
}

export default verifyToken