import { Router } from "express";
import { register, login, profile, updateUser, getAllUsers, getAllWorkers, createWorkers, deleteUsersByAdmin} from "../controllers/usersControllers";
import { auth } from "../middleware/auth";
import { isSuperAdmin } from "../middleware/isSuperAdmin"; 

const userRoutes = Router();

userRoutes.post('/register', register)
userRoutes.post('/login', login)
userRoutes.get('/profile',auth, profile)
userRoutes.put('/update',auth, updateUser)
userRoutes.get('/all',auth,isSuperAdmin, getAllUsers)
userRoutes.get('/allWorkers',auth, getAllWorkers)
userRoutes.post('/createWorkers',auth,isSuperAdmin, createWorkers)
userRoutes.delete('/deleteUser',auth,isSuperAdmin, deleteUsersByAdmin)

export {userRoutes}