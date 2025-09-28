import jwt from "jsonwebtoken"
import { SECRET_JWT } from "../config/config.js";

export default function authenticationToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
        return res.status(401).json({
            message: "token missing"
        })
    }

    jwt.verify(token, SECRET_JWT, (err, user) => {
        if(err) return res.status(401).json({message: "token invalid"});
        req.user = user;
        next();
    })
}