import { Router } from "express";
import { register, login, profile, updateUser, getAllUsers, getAllWorkers, createWorker, deleteUserBySuperAdmin, assignRole } from "../controllers/usersControllers";
import { auth } from "../middleware/auth";
import { isSuperAdmin } from "../middleware/isSuperAdmin";

const userRoutes = Router();

userRoutes.post('/register', register)
userRoutes.post('/login', login)
userRoutes.get('/profile', auth, profile)
userRoutes.put('/update', auth, updateUser)
userRoutes.get('/all', auth, isSuperAdmin, getAllUsers)
userRoutes.get('/allWorkers', getAllWorkers)
userRoutes.post('/createWorker', auth, isSuperAdmin, createWorker)
userRoutes.delete('/deleteUser', auth, isSuperAdmin, deleteUserBySuperAdmin)
userRoutes.put('/assignRole', auth,isSuperAdmin, assignRole)

export { userRoutes }