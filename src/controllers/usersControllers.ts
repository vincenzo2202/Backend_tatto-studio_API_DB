import { Request, Response } from "express-serve-static-core"
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Role } from "../models/Role";

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
                role_id: users.is_active,
                created_at: users.is_active,
                updated_at: users.is_active
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
                    phone_number: users.phone_number
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
            phone_number: createUserBody.phone_number,
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

        if (!deleteById) {
            return res.json({
                success: true,
                message: "you must insert one id",
            })
        }

        if (typeof (deleteById) !== "number") {
            return res.json({
                success: true,
                mensaje: "id incorrect, you can put only numbers, try again"
            });
        }

        const deleteAppointmentById = await User.delete({
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
        const bodyUser = req.body
        const id = req.body.id
        const role_id= req.body.role_id

        if(!role_id){
            return res.json({
                success: true,
                message: "You have to insert a role_id" 
            })
        }

        if(!id){
            return res.json({
                success: true,
                message: "You have to insert a id" 
            })
        }

        if(role_id>3 || role_id<1){
            return res.json({
                success: true,
                message: "role incorrect " 
            })
        } 

        const users = await User.find()
            
        const mapping = users.map((obj)=>obj.id)

        if(!mapping.includes(id)){
            return res.json({
                success: true,
                message: "user_id not exist."
            })
        }
        const updateOneUser = await User.update({
            id:id
        }, { 
            role_id: role_id
        }) 

        return res.json({
            success: true,
            message: "Role updated successfully.",
            data: {
                full_name: bodyUser.full_name,
                email: bodyUser.email, 
                role_id: bodyUser.role_id
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