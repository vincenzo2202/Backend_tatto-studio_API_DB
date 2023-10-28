import { Request, Response } from "express-serve-static-core"
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req: Request, res: Response) => {

    try {
        const createUserBody = req.body;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{4,12}$/;

        if (typeof (createUserBody.full_name) !== "string") {
            return res.json({
                success: true,
                mensaje: 'name incorrect, you can put only strings, try again'
            });
        }

        if (createUserBody.full_name.length < 1) {
            return res.json({
                success: true,
                mensaje: 'name too long, try to insert a shorter name, max 50 characters'
            });
        }
        if (createUserBody.full_name.length > 50) {
            return res.json({
                success: true,
                mensaje: 'name too long, try to insert a shorter name, max 50 characters'
            });
        }

        if (typeof (createUserBody.email) !== "string") {
            return res.json({
                success: true,
                mensaje: 'email incorrect, you can put only strings, try again'
            });
        }

        if (createUserBody.email.length > 100) {
            return res.json({
                success: true,
                mensaje: 'name too long, try to insert a shorter name, max 100 characters'
            });
        }

        if (!emailRegex.test(req.body.email)) {
            return res.json({
                success: true,
                mensaje: 'email incorrect, try again'
            });
        }

        if (typeof (createUserBody.password) !== "string") {
            return res.json({
                success: true,
                mensaje: 'password incorrect, you can put only strings, try again'
            });
        }

        if (createUserBody.password.length > 100) {
            return res.json({
                success: true,
                mensaje: 'password too long, try to insert a shorter name, max 100 characters'
            });
        }

        if (!passwordRegex.test(req.body.password)) {
            return res.json({
                success: true,
                mensaje: 'password incorrect, try again'
            });
        }

        if (typeof (createUserBody.phone_number) !== "number") {
            return res.json({
                success: true,
                mensaje: 'phone_number incorrect, you can put only numbers, try again'
            });
        }

        if (createUserBody.phone_number.length > 20) {
            return res.json({
                success: true,
                mensaje: 'phone_number too long, try to insert a shorter name, max 20 characters'
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
            message: "user registered succesfully",
            data: {
                full_name: newUser.full_name,
                email: newUser.email,
                phone_number: newUser.phone_number
            }
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "user can't be registered, try again",
            error
        })
    }
}

const login = async (req: Request, res: Response) => {

    try {
        const email = req.body.email;
        const password = req.body.password;

        const loginByEmail = await User.findOne({
            where: { email },
            relations: ["role"]
        });

        if (!loginByEmail) {
            return res.json({
                success: true,
                message: "user or password incorrect"
            })
        }

        if (!bcrypt.compareSync(password, loginByEmail.password)) {
            return res.json({
                success: true,
                message: "user or password incorrect"
            })
        }

        const roles = loginByEmail.role.role_name;

        const token = jwt.sign({
            id: loginByEmail.id,
            email: loginByEmail.email,
            role: roles
        }, "secreto", {
            expiresIn: "3h"
        })

        return res.json({
            success: true,
            message: "user logged succesfully",
            token: token
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "user can't by logged",
            error
        })
    }
}

const profile = async (req: Request, res: Response) => {

    try {
        const email = req.token.email
        const profileUser = await User.findOneBy({
            email
        })

        return res.json({
            success: true,
            message: "profile user retrieved",
            data: {
                full_name: profileUser?.full_name,
                email: profileUser?.email,
                phone_number: profileUser?.phone_number
            }
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "user profile can't be retrieved",
            error
        })
    }
}

const updateUser = async (req: Request, res: Response) => {

    try {
        const bodyUser = req.body
        const id = req.token.id

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{4,12}$/;

        if (typeof (bodyUser.full_name) !== "string") {
            return res.json({
                success: true,
                mensaje: 'Name is incorrect; only strings are allowed. Please try again.'
            });
        }

        if (bodyUser.full_name.length > 50) {
            return res.json({
                success: true,
                mensaje: 'Name is too long. Please insert a shorter name (maximum 50 characters).'
            });
        }

        if (typeof (bodyUser.password) !== "string") {
            return res.json({
                success: true,
                mensaje: 'Password is incorrect; only strings are allowed. Please try again'
            });
        }

        if (bodyUser.password.length > 100) {
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

        if (typeof (bodyUser.phone_number) !== "number") {
            return res.json({
                success: true,
                mensaje: 'Phone number is incorrect; only numbers are allowed. Please try again'
            });
        }

        if (bodyUser.phone_number.length > 20) {
            return res.json({
                success: true,
                mensaje: 'Phone number is too long. Please insert a shorter number (maximum 20 characters).'
            });
        }

        const encrytedPassword = await bcrypt.hash(bodyUser.password, 10)

        const updateOneUser = await User.update({
            id
        }, {
            full_name: bodyUser.full_name,
            password: encrytedPassword,
            phone_number: bodyUser.phone_number
        })

        return res.json({
            success: true,
            message: "User updated successfully.",
            data: {
                full_name: bodyUser.full_name,
                phone_number: bodyUser.phone_number
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

const getAllUsers = async (req: Request, res: Response) => {
    try {

        const users = req.body
        const profileUser = await User.find();

        if (users.length == 0) {
            return res.json({
                success: false,
                message: "there are not any registered users",

            })
        }

        const mappingUsers = profileUser.map(users => {
            return {
                id: users.id,
                email: users.email,
                name: users.full_name,
                phone_number: users.phone_number,
                is_active: users.is_active,
                role_id:users.is_active,
                created_at:users.is_active,
                updated_at:users.is_active
            };
        });

        return res.json({
            success: true,
            message: "profile user retrieved",
            data: mappingUsers
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "user profile can't be retrieved",
            error
        })
    }


}

export { register, login, profile, updateUser, getAllUsers } 