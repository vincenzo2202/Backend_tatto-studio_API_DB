import { Router } from "express";
import { createAppointment, deleteAppointment, getAllArtist, getAllMyAppointment, getallAppointmentDetail, updateAppointment } from "../controllers/appointmentControllers";
import { auth } from "../middleware/auth";
import { isAdmin } from "../middleware/isAdmin";
import { isSuperAdmin } from "../middleware/isSuperAdmin";

const appointmentRoutes = Router();

appointmentRoutes.post('/createAppointment',auth, createAppointment)
appointmentRoutes.put('/updateAppointment',auth, updateAppointment)
appointmentRoutes.delete('/deleteAppointment',auth, deleteAppointment)
appointmentRoutes.get('/getAllAppointment',auth, getAllMyAppointment)
appointmentRoutes.get('/getAllArtist',auth, isAdmin, getAllArtist)
appointmentRoutes.get('/AllAppointmentsSuper',auth, isSuperAdmin, getallAppointmentDetail)




export {appointmentRoutes}