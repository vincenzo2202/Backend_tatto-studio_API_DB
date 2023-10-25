import { Router } from "express";
import { register, login, profile, updateUser, getAllUsers } from "../controllers/usersControllers";

const userRoutes = Router();

userRoutes.post('/register', register)
userRoutes.post('/login', login)
userRoutes.get('/profile', profile)
userRoutes.put('/update', updateUser)
userRoutes
userRoutes.get('/all', getAllUsers)

export {userRoutes}