import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from 'jsonwebtoken'
import config from "../config";
import { pool } from "../db";
import type { ROLE } from "../Types";



const auth = (...roles : ROLE[]) => {
    
    return async (req: Request, res: Response, next: NextFunction) => {
        console.log(roles)
        try {
            const token = req.headers.authorization;

        //console.log(token);
        if(!token){
            res.status(401).json({
            success: false,
            message: "Unauthorize access!!",
        })
        }
        const decoded = jwt.verify(token as string, config.secrete as string) as JwtPayload;
        console.log(decoded)
        const userData = await pool.query(`
            SELECT * FROM users WHERE email = $1
            `, [decoded.email])

        if(userData.rows.length === 0){
            res.status(404).json({
            success: false,
            message: "User Not Found!!",
        })
        }
        

        req.user = decoded
        if(roles.length && !roles.includes(req.user.role)){
            res.status(400).json({
            success: false,
            message: "Bad Request!!",
        })
        }
        next();


        } catch (error) {
            next(error)
        }
    }
}

export default auth;