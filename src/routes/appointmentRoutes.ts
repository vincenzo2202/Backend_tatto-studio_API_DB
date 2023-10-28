import { Router } from "express";
import { createAppointment, deleteAppointment, getAppointment, updateAppointment } from "../controllers/appointmentControllers";

const appointmentRoutes = Router();

appointmentRoutes.post('/createAppointmet', createAppointment)
appointmentRoutes.put('/updateAppointmet', updateAppointment)
appointmentRoutes.delete('/deleteAppointmet', deleteAppointment)
appointmentRoutes.get('/updateAppointmet', getAppointment)


appointmentRoutes.get