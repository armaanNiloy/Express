import { Router, type NextFunction, type Request, type Response } from "express";
import { pool } from "../../db";
import { userController } from "./users.controller";
import auth from "../../middleware/auth";
import { user_role } from "../../Types";


const router = Router()




router.post('/', userController.createUser)
router.get('/',  auth(user_role.admin, user_role.agent),userController.getUsers)
router.get('/:id', userController.getSingleUser )
router.put('/:id', userController.updateUser )
router.delete('/:id', userController.deleteUser)

export const userRoute = router;