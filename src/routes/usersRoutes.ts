import { Router } from "express";  
import { login, profile, register, updateUser } from "../controllers/usersControllers";

const usersRoutes = Router()

//registro de usuarios 
usersRoutes.post("/register", register)
//login de usuarios
usersRoutes.post("/login", login)
//perfil de usuario
usersRoutes.get("/profile", profile)
//modificacion de perfil
usersRoutes.put("/:id", updateUser)

// get all users
usersRoutes 



export {usersRoutes}