import { Request, Response } from "express"


const getUsers = (req:Request, res: Response) =>{
return res.json(`USERS`)
}
const createUsers = (req:Request, res: Response)=>{
return res.json(`USERS`)
} 
const updateUsers = (req:Request, res: Response)=>{
return res.json(`USERS`)
} 
const deleteUsers = (req:Request, res: Response)=>{
return res.json(`USERS`)
} 


export { getUsers,createUsers,updateUsers,deleteUsers}