import { Router, type Request, type Response } from "express";
import { pool } from "../../db";
import { userController } from "./users.controller";


const router = Router()

router.post('/', userController.createUser)

router.get('/', userController.getUsers)

router.get('/:id', userController.getSingleUser )

router.put('/:id', userController.updateUser )

router.delete('/:id', userController.deleteUser)

export const userRoute = router;