import jwt from 'jsonwebtoken'

function verifyToken(req, res, next){
    if(!req.headers.authorization){
        return res.sendStatus(401);
    }

    const bearerToken = req.headers.authorization.split(' ')

    if (bearerToken.length != 2 || 
        bearerToken[0] != 'Bearer'){
        return res.sendStatus(401)
    }

    const token = req.headers.authorization.split(' ').pop()

    jwt.verify(token, process.env.SECRET, (error, user) => {
        if(error){
            return res.sendStatus(403)
        }

        req.user = user
        next()
    })
}

export default verifyToken