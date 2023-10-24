import { Router } from "express";
import { createUsers, deleteUsers, getUsers, updateUsers } from "../controllers/usersControllers";

const usersRoutes = Router()


usersRoutes.get("/", getUsers)
usersRoutes.post("/", createUsers)
usersRoutes.put("/", updateUsers)
usersRoutes.delete("/", deleteUsers)

export {usersRoutes}