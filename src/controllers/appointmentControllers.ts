import { Request, Response } from "express"
import { Appointment } from "../models/Appointment"


const createAppointment = async (req:Request, res: Response)=>{
    
    try {
    const getAppointmentBody = req.body
    const getAppointmentId = req.token.id

    const createAppointment = await Appointment.create({ 
        date:getAppointmentBody.id,
        time:getAppointmentBody,
        worker_id:getAppointmentBody,
        client_id:getAppointmentId
    }).save()
    return res.json({
        success: true,
        message: "appointment registered succesfully",
        data:{
            date: getAppointmentBody.date,
            time:getAppointmentBody.time,
            worker_id: getAppointmentBody.worker_id
        }
       
    })
} catch (error) {
    return res.json({
        success: false,
        message: "error creating an appointment",
        error
    })
}

}
const updateAppointment = (req:Request, res: Response)=>{

}
const deleteAppointment = (req:Request, res: Response)=>{

}
const getAppointment = (req:Request, res: Response)=>{

}

export {createAppointment,updateAppointment,deleteAppointment, getAppointment}