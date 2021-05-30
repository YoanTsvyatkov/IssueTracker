import jwt from "jsonwebtoken";

function signToken(email, password, timeExpiration){
    return jwt.sign(
        { email: email, password },
        process.env.SECRET,
        { expiresIn: timeExpiration }
      );
}

export default signToken;