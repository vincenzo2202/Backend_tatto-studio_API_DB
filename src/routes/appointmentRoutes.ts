import { Router } from "express";
import { createAppointment, deleteAppointment, updateAppointment } from "../controllers/appointmentControllers";
import { auth } from "../middleware/auth";

const appointmentRoutes = Router();

appointmentRoutes.post('/createAppointment',auth, createAppointment)
appointmentRoutes.put('/updateAppointment',auth, updateAppointment)
appointmentRoutes.delete('/deleteAppointment',auth, deleteAppointment)




export {appointmentRoutes}