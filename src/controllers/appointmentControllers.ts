import { Request, Response } from "express"
import { Appointment } from "../models/Appointment"
import { User } from "../models/User";


const createAppointment = async (req: Request, res: Response) => {

    try {
        const appointmentBody = req.body
        const email = req.body.email
        const id = req.token.id

        const loginByEmail = await User.findOne({
            where: { email },
            relations: ["role"]
        });

        if(loginByEmail?.role.role_name !== "admin"){
            return res.json({
                success: true,
                message: "sorry, this user isn't a worker, try again"
            })
        }

        if(id == loginByEmail.id){
            return res.json({
                success: true,
                message: "sorry, you can't create a appointment with yourself"
            })
        }

      
            
        const createNewAppointment = await Appointment.create({
            date: appointmentBody.date,
            time: appointmentBody.time,
            worker_id: loginByEmail.id,
            client_id: id
        }).save()
    
        return res.json({
            success: true,
            message: "appointment created succesfully",
            data: {
                date: createNewAppointment.date,
                time: createNewAppointment.time,
                email: email,
                created_at: createNewAppointment.created_at,
                updated_at: createNewAppointment.updated_at
            }
        })
        
    } catch (error) {
        return res.json({
            success: false,
            message: "appointment can't be created, try again",
            error
        })
    }
}


//commitear el create appointment

const updateAppointment = (req:Request, res: Response)=>{

}
const deleteAppointment = async(req:Request, res: Response)=>{

}
 

export {createAppointment,updateAppointment,deleteAppointment}