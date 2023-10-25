import { Request, Response } from "express"


const register = (req:Request, res: Response) =>{
return res.json(`USERS`)
}
const login = (req:Request, res: Response)=>{
return res.json(`USERS`)
} 
const profile = (req:Request, res: Response)=>{
return res.json(`USERS`)
} 
const updateUser = (req:Request, res: Response)=>{
return res.json(`USERS`)
} 


export { register,login,profile,updateUser}