import { Router } from "express";
import { createAppointment, deleteAppointment, getAppointment, updateAppointment } from "../controllers/appointmentControllers";
import { auth } from "../middleware/auth";

const appointmentRoutes = Router();

appointmentRoutes.post('/createAppointmet',auth, createAppointment)
appointmentRoutes.put('/updateAppointmet',auth, updateAppointment)
appointmentRoutes.delete('/deleteAppointmet',auth, deleteAppointment)
appointmentRoutes.get('/updateAppointmet', auth, getAppointment)


appointmentRoutes.get

export {appointmentRoutes}