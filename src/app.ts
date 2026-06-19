import express, { response, type Application, type Request, type Response } from "express"
import { pool } from "./db";
import { userRoute } from "./modules/users/users.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRouter } from "./modules/auth/auth.route";
import fs from 'fs';
import { CLIENT_RENEG_LIMIT } from "tls";
import logger from "./middleware/logger";
import CookiePerser from 'cookie-parser';
import cookieParser from "cookie-parser";
import cors from 'cors'
import globalErrorHandeler from "./middleware/globalErrorHandeler";

const app: Application = express();


app.use(cookieParser())
app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))

app.use(logger);

app.use(cors({
  origin: 'http://localhost:5000',
}))

app.get('/', (req: Request, res: Response) => {
  // res.send('Express Serversss')
  res.status(200).json({
    "message": "Express Server",
    "author": "next level"
  })
})

app.use('/api/users', userRoute);
app.use('/api/profile', profileRoute);
app.use("/api/auth", authRouter);

// Global Error Handling Middleware
app.use(globalErrorHandeler);










export default app;