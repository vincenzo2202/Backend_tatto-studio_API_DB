import { Router } from "express";
import { createAppointment, deleteAppointment, getAllArtist, getAllMyAppointment, updateAppointment } from "../controllers/appointmentControllers";
import { auth } from "../middleware/auth";
import { isAdmin } from "../middleware/isAdmin";

const appointmentRoutes = Router();

appointmentRoutes.post('/createAppointment',auth, createAppointment)
appointmentRoutes.put('/updateAppointment',auth, updateAppointment)
appointmentRoutes.delete('/deleteAppointment',auth, deleteAppointment)
appointmentRoutes.get('/getAllAppointment',auth, getAllMyAppointment)
appointmentRoutes.get('/getAllArtist',auth, isAdmin, getAllArtist)




export {appointmentRoutes}