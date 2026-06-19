import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { error } from "console";


const loginUserIntoDB = async (payload: { email: string, password: string }) => {
    const { email, password } = payload;

    const userData = await pool.query(`
        SELECT * FROM users WHERE email = $1
        `, [email])

    const user = userData.rows[0];
    if (userData.rows[0].length === 0) {
        throw new Error("Invalid Credential!");
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    console.log(comparePassword);
    if (!comparePassword) {
        throw new Error("Invalid Credential!");
    }

    //generate Token
    const jwtpayload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        is_active: user.is_active
    }
    const accessToken = jwt.sign(jwtpayload, config.secrete as string, { expiresIn: "1d" })
    const refreshToken = jwt.sign(jwtpayload, config.refresh_secrete as string, { expiresIn: "10d" })
    return { accessToken, refreshToken };
}

const generateRefreshToken = async (token: string) => {

    if (!token) {
        throw new Error("Unauthorized !!!")
    }

    const decoded = jwt.verify(token as string, config.refresh_secrete as string) as JwtPayload;
    
    const userData = await pool.query(`
            SELECT * FROM users WHERE email = $1
            `, [decoded.email])

    const user = userData.rows[0];
    // console.log(user)
    if (userData.rows.length === 0) {
        throw new Error("User not found !!!")
    }

    const jwtpayload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        is_active: user.is_active
    }
    const accessToken = jwt.sign(jwtpayload, config.secrete as string, { expiresIn: "1d" })
    // console.log(accessToken)
    return { accessToken };

}

export const authService = {
    loginUserIntoDB,
    generateRefreshToken
}