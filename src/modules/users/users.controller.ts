import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./users.service";



const createUser = async (req: Request, res: Response) => {
    // console.log(req.body);
    try {
        const result = await userService.createUserIntoDB(req.body);

        res.status(201).json({
            message: "User Created Successfully!!!",
            data: result.rows[0],
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            error: error,
        })
    }
}

const getUsers = async (req: Request, res: Response) => {
    try {
        const result = await userService.getUsersFromDB();
        res.status(200).json({
            success: true,
            message: "Users retrive successfully",
            data: result.rows
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
}

const getSingleUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    //console.log(id);
    try {
        const result = await userService.getSingleUser(id as string);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User Not Found",
                data: {}
            })
        }
        res.status(200).json({
            success: true,
            message: "User Retrive successfully",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
}

const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, password, is_active } = req.body;
    try {
        const result = await userService.updateUserFromDB(id as string, req.body)
        console.log(result.rows.length);
        if (result.rows.length === 0) {
            res.status(500).json({
                success: false,
                message: "User Not Updated",
                data: {}
            })
        }
        res.status(200).json({
            success: true,
            message: "User Updated successfully",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
}


const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(id)
    try {
        const result = await userService.deleteUserFromDB(id as string);
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User Not Found",
                data: {}
            })
        }
        res.status(200).json({
            success: true,
            message: "User Deleted successfully",
            data: {}
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }


}


export const userController = {
    createUser,
    getUsers,
    getSingleUser,
    updateUser,
    deleteUser
}