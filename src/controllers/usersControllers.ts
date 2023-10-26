import { Request, Response } from "express-serve-static-core"
import { User } from "../models/User";
import bcrypt from "bcrypt"

const register = async (req: Request, res: Response) => {

    try {
        const createUserBody = req.body; 
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{4,12}$/;

        if (typeof (createUserBody.full_name) !== "string") {
            return res.json({
                success: true,
                mensaje: 'Name is incorrect; only strings are allowed. Please try again.'
            });
        }

        if (createUserBody.full_name.length > 50) {
            return res.json({
                success: true,
                mensaje: 'Name is too long. Please insert a shorter name (maximum 50 characters).'
            });
        }

        if (typeof (createUserBody.email) !== "string") {
            return res.json({
                success: true,
                mensaje: 'Email is incorrect; only strings are allowed. Please try again'
            });
        }

        if (createUserBody.email.length > 100) {
            return res.json({
                success: true,
                mensaje: 'Name is too long. Please insert a shorter name (maximum 100 characters).'
            });
        }

        if (!emailRegex.test(req.body.email)) {
            return res.json({
                success: true,
                mensaje: 'Email is incorrect. Please try again.'
            });
        }

        if (typeof (createUserBody.password) !== "string") {
            return res.json({
                success: true,
                mensaje: 'Password is incorrect; only strings are allowed. Please try again'
            });
        }

        if (createUserBody.password.length > 100) {
            return res.json({
                success: true,
                mensaje: 'Password is too long. Please insert a shorter password (maximum 100 characters).'
            });
        }

        if (!passwordRegex.test(req.body.password)) {
            return res.json({
                success: true,
                mensaje: 'Password is incorrect. Please try again'
            });
        }

        if (typeof (createUserBody.phone_number) !== "number") {
            return res.json({
                success: true,
                mensaje: 'Phone number is incorrect; only numbers are allowed. Please try again'
            });
        }

        if (createUserBody.phone_number > 20) {
            return res.json({
                success: true,
                mensaje: 'Phone number is too long. Please insert a shorter number (maximum 20 characters).'
            });
        }

        const encrytedPassword = await bcrypt.hash(createUserBody.password, 10)

        const newUser = await User.create({
            full_name: createUserBody.full_name,
            email: createUserBody.email,
            password: encrytedPassword,
            phone_number: createUserBody.phone_number
        }).save()

        return res.json({
            success: true,
            message: "User registered successfully.",
            data: {
                full_name: createUserBody.full_name,
                email: createUserBody.email,
                phone_number: createUserBody.phone_number
            }
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "User can't be registered, please try again.",
            error
        })
    }
}
const login = (req: Request, res: Response) => {

}
const profile = (req: Request, res: Response) => {

}
const updateUser = (req: Request, res: Response) => {

}

const getAllUsers = (req: Request, res: Response) => {

}

export { register, login, profile, updateUser, getAllUsers } 