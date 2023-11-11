import { Request, Response } from "express-serve-static-core"
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const { validateEmail, validateDate, validateShift, validateString, validateAvailableDate, validateNumber, validatePassword, validatePhoto} = require('../validations/validations');

const register = async (req: Request, res: Response) => {
    try {
        const { full_name, email, password, phone_number, photo } = req.body

        if (validateString(full_name, 50)) {
            return res.json({ success: true, message: validateString(full_name, 50) });
        }

        if (validateEmail(email)) {
            return res.json({ success: true, message: validateEmail(email) });
        }

        if (validatePassword(password)) {
            return res.json({ success: true, message: validatePassword(password) });
        }
        if (validateNumber(phone_number, 12)) {
            return res.json({ success: true, message: validateNumber(phone_number, 12) });
        }

        if (validatePhoto(photo, 500)) {
            return res.json({ success: true, message: validatePhoto(photo, 500) });
        }

        const encrytedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            full_name: full_name,
            email: email,
            password: encrytedPassword,
            phone_number: phone_number,
            photo:photo
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
        const { email, password } = req.body

        const loginByEmail = await User.findOne({
            where: { email },
            relations: ["role"]
        });

        if (loginByEmail?.is_active !== true) {
            return res.json({
                success: true,
                message: "user doesn't exist"
            })
        }

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
        const secret = process.env.JWT_SECRET as string
        const token = jwt.sign({
            id: loginByEmail.id,
            email: loginByEmail.email,
            role: roles
        }, secret, {
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

        if (validateEmail(email)) {
            return res.json({ success: true, message: validateEmail(email) });
        }

        return res.json({
            success: true,
            message: "profile user retrieved",
            data: {
                full_name: profileUser?.full_name,
                email: profileUser?.email,
                phone_number: profileUser?.phone_number,
                photo:profileUser?.photo
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
        const { full_name, password, phone_number , photo} = req.body
        const id = req.token.id

        if (validateString(full_name, 50)) {
            return res.json({ success: true, message: validateString(full_name, 50) });
        }

        if (validatePassword(password)) {
            return res.json({ success: true, message: validatePassword(password) });
        }
        if (validateNumber(phone_number, 12)) {
            return res.json({ success: true, message: validateNumber(phone_number, 12) });
        } 

        if (validatePhoto(photo, 500)) {
            return res.json({ success: true, message: validatePhoto(photo, 500) });
        }

        const encrytedPassword = await bcrypt.hash(password, 10)

        await User.update({
            id
        }, {
            full_name: full_name,
            password: encrytedPassword,
            phone_number: phone_number,
            photo: photo
        })

        return res.json({
            success: true,
            message: "User updated successfully.",
            data: {
                full_name: full_name,
                phone_number: phone_number
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
        if (typeof (req.query.skip) !== "string") {
            return res.json({
                success: true,
                message: "skip it's not string."
            })
        }

        if (typeof (req.query.page) !== "string") {
            return res.json({
                success: true,
                message: "page it's not string."
            })
        }

        const pageSize = parseInt(req.query.skip as string) || 5
        const page: any = parseInt(req.query.page as string) || 1
        const skip = (page - 1) * pageSize

        const profileUser = await User.find({
            skip: skip,
            take: pageSize
        })

        if (profileUser.length == 0) {
            return res.json({
                success: false,
                message: "there are not any registered users"
            })
        }

        const mappingUsers = profileUser.map(users => {
            const { password, ...rest } = users
            return {...rest};
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

const getAllWorkers = async (req: Request, res: Response) => {
    try {
        if (typeof (req.query.skip) !== "string") {
            return res.json({
                success: true,
                message: "skip it's not string."
            })
        }

        if (typeof (req.query.page) !== "string") {
            return res.json({
                success: true,
                message: "page it's not string."
            })
        }

        const pageSize = parseInt(req.query.skip as string) || 5
        const page: any = parseInt(req.query.page as string) || 1
        const skip = (page - 1) * pageSize

        const profileUser = await User.find({
            where: {
                role_id: 2
            },
            skip: skip,
            take: pageSize
        });

        if (profileUser.length == 0) {
            return res.json({
                success: false,
                message: "there are not any registered worker"
            })
        }

        const mappingUsers = profileUser.map(users => {
            if (users.is_active == true) {
                return {
                    email: users.email,
                    name: users.full_name,
                    phone_number: users.phone_number,
                    photo: users.photo
                };
            }
        });

        return res.json({
            success: true,
            message: "here you have all workers",
            data: mappingUsers
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "workers can't be retrieved",
            error
        })
    }
}

const createWorker = async (req: Request, res: Response) => {
    try {
        const { full_name, email, password, phone_number, photo } = req.body;

        if (validateString(full_name, 50)) {
            return res.json({ success: true, message: validateString(full_name, 50) });
        }

        if (validateEmail(email)) {
            return res.json({ success: true, message: validateEmail(email) });
        }

        if (validatePassword(password)) {
            return res.json({ success: true, message: validatePassword(password) });
        }
        if (validateNumber(phone_number, 12)) {
            return res.json({ success: true, message: validateNumber(phone_number, 12) });
        }

        if (validatePhoto(photo, 500)) {
            return res.json({ success: true, message: validatePhoto(photo, 500) });
        }

        const encrytedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            full_name: full_name,
            email: email,
            password: encrytedPassword,
            phone_number: phone_number,
            photo:photo,
            role_id: 2 
        }).save()

        return res.json({
            success: true,
            message: "worker registered succesfully",
            data: {
                full_name: newUser.full_name,
                email: newUser.email,
                phone_number: newUser.phone_number
            }
        })
    } catch (error) {
        return res.json({
            success: false,
            message: "worker can't be registered, try again",
            error
        })
    }

}

const deleteUserBySuperAdmin = async (req: Request, res: Response) => {
    try {
        const deleteById = req.body.id

        if (validateNumber(deleteById, 7)) {
            return res.json({ success: true, message: validateNumber(deleteById, 12) });
        }

        await User.delete({
            id: deleteById
        })

        return res.json({
            success: true,
            message: "The user was successfully deleted.",
        })
    } catch (error) {
        return res.json({
            success: false,
            message: "Unable to delete the user, please try again.",
            error
        })
    }
}

const assignRole = async (req: Request, res: Response) => {
    try {
        const { id, role_id, full_name, email } = req.body

        if (validateNumber(role_id, 2)) {
            return res.json({ success: true, message: validateNumber(role_id, 2) });
        }

        if (role_id > 3 || role_id < 1) {
            return res.json({
                success: true,
                message: "role incorrect "
            })
        }

        if (validateNumber(id, 2)) {
            return res.json({ success: true, message: validateNumber(id, 2) });
        }

        const users = await User.find()
        const mapping = users.map((obj) => obj.id)

        if (!mapping.includes(id)) {
            return res.json({
                success: true,
                message: "user_id not exist."
            })
        }

        await User.update({
            id: id
        }, 
        {
            role_id: role_id
        })

        return res.json({
            success: true,
            message: "Role updated successfully.",
            data: {
                full_name: full_name,
                email: email,
                role_id: role_id
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

export { register, login, profile, updateUser, getAllUsers, getAllWorkers, createWorker, deleteUserBySuperAdmin, assignRole } 