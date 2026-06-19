import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";


const loginUserIntoDB = async( payload : {email : string, password : string}) =>{
    const { email, password} = payload;

    const userData = await pool.query(`
        SELECT * FROM users WHERE email = $1
        `, [email])

    const user = userData.rows[0];
    if(userData.rows[0].length === 0){
        throw new Error("Invalid Credential!");
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    console.log(comparePassword);
    if(!comparePassword){
        throw new Error("Invalid Credential!");
    }

    //generate Token
    const jwtpayload = {
        id : user.id,
        email : user.email,
        name : user.name,
        role : user.role,
        is_active : user.is_active
    }
    const accessToken = jwt.sign(jwtpayload, config.secrete as string, {expiresIn : "1d"})
    return {accessToken};
}

export const authService = {
    loginUserIntoDB,
}