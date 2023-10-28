import { Request, Response } from "express"
import { Appointment } from "../models/Appointment"


const createAppointment = async (req: Request, res: Response) => {
    try {
        const appointmentData = req.body;
        const clientId = req.token.id;
 
        const newAppointment = await Appointment.create({ 
            date: appointmentData.date,
            time: appointmentData.time,
            worker_id: appointmentData.worker_id,
            client_id: clientId
        }).save();

        return res.json({
            success: true,
            message: "Appointment registered successfully",
            data: {
                date: newAppointment.date,
                time: newAppointment.time,
                worker_id: newAppointment.worker_id
            }
        });
    } catch (error) {
        return res.json({
            success: false,
            message: "Error creating an appointment",
            error
        });
    }
}



const updateAppointment = (req:Request, res: Response)=>{

}
const deleteAppointment = (req:Request, res: Response)=>{

}
const getAppointment = (req:Request, res: Response)=>{

}

export {createAppointment,updateAppointment,deleteAppointment, getAppointment}