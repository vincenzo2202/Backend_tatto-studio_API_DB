import { Router } from "express";
import { register, login, profile, updateUser, getAllUsers } from "../controllers/usersControllers";
import { auth } from "../middleware/auth";
import { isSuperAdmin } from "../middleware/isSuperAdmin";

const userRoutes = Router();

userRoutes.post('/register', register)
userRoutes.post('/login', login)
userRoutes.get('/profile',auth, profile)
userRoutes.put('/update',auth, updateUser)
userRoutes.get('/all',auth,isSuperAdmin, getAllUsers)

export {userRoutes}