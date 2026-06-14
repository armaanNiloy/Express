import express, { response, type Application, type Request, type Response } from "express"
import { pool } from "./db";
import { userRoute } from "./modules/users/users.route";
const app: Application = express();



app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))




app.get('/', (req: Request, res: Response) => {
  // res.send('Express Serversss')
  res.status(200).json({
    "message": "Express Server",
    "author": "next level"
  })
})

app.use('/api/users', userRoute);












export default app;