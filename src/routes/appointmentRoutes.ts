import { Router } from "express";
import { appointmentValidation, createAppointment, deleteAppointment, getAllArtist, getAllMyAppointment, getAppointmentDetail, getallAppointmentSuperAdmin, updateAppointment } from "../controllers/appointmentControllers";
import { auth } from "../middleware/auth";
import { isAdmin } from "../middleware/isAdmin";
import { isSuperAdmin } from "../middleware/isSuperAdmin";

const appointmentRoutes = Router();

appointmentRoutes.post('/createAppointment',auth, createAppointment)
appointmentRoutes.put('/updateAppointment',auth, updateAppointment)
appointmentRoutes.delete('/deleteAppointment',auth, deleteAppointment)
appointmentRoutes.get('/getAllAppointment',auth, getAllMyAppointment)
appointmentRoutes.get('/getAllArtist',auth, isAdmin, getAllArtist)
appointmentRoutes.get('/AllAppointmentsSuper',auth, isSuperAdmin, getallAppointmentSuperAdmin)
appointmentRoutes.get('/appointmentDetail',auth, getAppointmentDetail)
appointmentRoutes.get('/validation',auth, appointmentValidation)


export {appointmentRoutes}