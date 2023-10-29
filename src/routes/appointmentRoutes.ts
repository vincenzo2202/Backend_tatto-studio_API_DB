import { Router } from "express";
import { createAppointment, deleteAppointment, updateAppointment } from "../controllers/appointmentControllers";
import { auth } from "../middleware/auth";

const appointmentRoutes = Router();

appointmentRoutes.post('/createAppointmet',auth, createAppointment)
appointmentRoutes.put('/updateAppointmet',auth, updateAppointment)
appointmentRoutes.delete('/deleteAppointmet',auth, deleteAppointment)




export {appointmentRoutes}