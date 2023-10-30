import { Request, Response } from "express"
import { Appointment } from "../models/Appointment"
import { User } from "../models/User";


const createAppointment = async (req: Request, res: Response) => {

    try {
        const date = req.body.date
        const time = req.body.time
        const email = req.body.email
        const idToken = req.token.id

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if (!email) {
            return res.json({
                success: true,
                message: "you must insert an email",
            })
        }

        if (typeof (email) !== "string") {
            return res.json({
                success: true,
                mensaje: 'Incorrect email, it should only contain strings'
            });
        }

        if (email.length > 100) {
            return res.json({
                success: true,
                mensaje: 'Email is too long, please try a shorter one. Maximum 100 characters'
            });
        }

        if (!emailRegex.test(email)) {
            return res.json({
                success: true,
                mensaje: 'Incorrect email format. Please try again'
            });
        }

        const findWorkerByEmail = await User.findOne({
            where: { email },
            relations: ["role"]
        });

        
        if(findWorkerByEmail?.is_active !== true){
            return res.json({
                success: true,
                message: "worker doesn't exist" 
            })
        }

        if (findWorkerByEmail?.role.role_name != "admin") {
            return res.json({
                success: true,
                message: "I'm sorry, the email you entered does not belong to any employee. Please enter a correct one"
            })
        }

        if (idToken == findWorkerByEmail.id) {
            return res.json({
                success: true,
                message: "I'm sorry, you can't create an appointment with yourself."
            })
        }

        if (!date) {
            return res.json({
                success: true,
                message: "you must insert an email",
            })
        }

        if (typeof (date) !== "string") {
            return res.json({
                success: true,
                mensaje: "Incorrect date format, it can only contain strings"
            });
        }

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (!dateRegex.test(date)) {
            return res.json({
                success: true,
                mensaje: "Incorrect date, the format should be YYYY-MM-DD."
            });
        }

        if (!time) {
            return res.json({
                success: true,
                message: "you must insert an email",
            })
        }

        if (typeof (time) !== "string") {
            return res.json({
                success: true,
                mensaje: "Incorrect time format, it can only contain stringsn"
            });
        }

        const timeRegex = /^\d{2}:\d{2}:\d{2}$/;

        if (!timeRegex.test(time)) {
            return res.json({
                success: true,
                mensaje: "Incorrect Time, the format should be HH:MM:SS."
            });
        }

        const createAppointment = await Appointment.create({
            date,
            time,
            worker_id: findWorkerByEmail.id,
            client_id: idToken
        }).save()

        return res.json({
            success: true,
            message: "Appointment created successfully",
            data: {
                date: createAppointment.date,
                time: createAppointment.time,
                email: email,
                id: createAppointment.id,
                created_at: createAppointment.created_at,
                updated_at: createAppointment.updated_at
            }
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "Appointment can't be created, try again",
            error
        })
    }
}

const updateAppointment = async (req: Request, res: Response) => {
    try {
        const client_id = req.token.id
        const body = req.body
        const appointmentId = body.id
        const date = body.date
        const time = body.time
        const email = body.email

        //regex de correo, fecha y hora
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        const timeRegex = /^\d{2}:\d{2}:\d{2}$/;

        //validacion del correo que sea string

        if (!email) {
            return res.json({
                success: true,
                message: "you must insert an email",
            })
        }

        if (typeof (email) !== "string") {
            return res.json({
                success: true,
                mensaje: 'Email incorrect, you can only enter strings. Please try again.'
            });
        }
        //validacion del correo que tenga maximo 100 caracteres
        if (email.length > 100) {
            return res.json({
                success: true,
                mensaje: 'Email too long, please insert a shorter name, maximum 100 characters.'
            });
        }

        //validacion del correo que tenga el formato regex establecido
        if (!emailRegex.test(email)) {
            return res.json({
                success: true,
                mensaje: 'Email format incorrect, try again'
            });
        }

        const findWorkerByEmail = await User.findOneBy({
            email
        })

        if(findWorkerByEmail?.is_active !== true){
            return res.json({
                success: true,
                message: "worker doesn't exist" 
            })
        } 

        const WorkerID = findWorkerByEmail?.id

        if (!appointmentId) {
            return res.json({
                success: true,
                message: "You must enter an ID.",
            })
        }

        //validacion de que el id de la cita tenga formato number
        if (typeof (appointmentId) !== "number") {
            return res.json({
                success: true,
                mensaje: "ID incorrect, you can only use numbers, please try again."
            });
        }

        if (!date) {
            return res.json({
                success: true,
                message: "you must insert an email",
            })
        }

        //validacion de la fecha
        if (typeof (date) !== "string") {
            return res.json({
                success: true,
                mensaje: "Date incorrect, you can only use strings, please try again."
            });
        }

        //validacion de la fecha con formato regex
        if (!dateRegex.test(date)) {
            return res.json({
                success: true,
                mensaje: "Date incorrect, The date format should be YYYY-MM-DD, please try again."
            });
        }

        if (!time) {
            return res.json({
                success: true,
                message: "you must insert an email",
            })
        }

        //validacion de la hora
        if (typeof (time) !== "string") {
            return res.json({
                success: true,
                mensaje: "Time incorrect, you can only use strings"
            });
        }

        //validacion de la hora formato regex
        if (!timeRegex.test(time)) {
            return res.json({
                success: true,
                mensaje: "Time incorrect, The time format should be HH:MM:SS, please try again."
            });
        }

        const appointmentsClient = await Appointment.findBy({
            client_id,
        })

        const appointmentsId = await appointmentsClient.map((object) =>
            object.id
        )

        //validacion de que el id de la cita  exista
        if (!appointmentsId.includes(appointmentId)) {
            return res.json(
                {
                    success: true,
                    message: "Appointment not updated successfully, incorrect ID."
                }
            )
        }

        await Appointment.update(
            {
                id: appointmentId
            },
            {
               date: date,
               time: time,
               worker_id: WorkerID
            }
        )

        const dataAppointmentUpdated = await Appointment.findOneBy({
            id: appointmentId
        })

        return res.json({
            success: true,
            message: "The appointment was successfully created.",
            data: {
                date,
                time,
                email,
                id: appointmentId,
                created_at: dataAppointmentUpdated?.created_at,
                updated_at: dataAppointmentUpdated?.updated_at
            }
        })

    } catch (error) {
        return res.json(
            {
                success: false,
                message: "Updating the appointment is currently not possible. Please try again.",
                error
            }
        )
    }
}

const deleteAppointment = async (req: Request, res: Response) => {

    try {
        const deleteById = req.body.id
        const clientId = req.token.id

        if (!deleteById) {
            return res.json({
                success: true,
                message: "you must insert one id",
            })
        }

        if (typeof (deleteById) !== "number") {
            return res.json({
                success: true,
                mensaje: "id incorrect, you can put only numbers, try again"
            });
        }

        const getUser = await Appointment.findBy({
            client_id: clientId
        })

        const appointments_id = getUser.map((appointment) =>
            appointment.id
        )

        if (!appointments_id.includes(deleteById)) {
            return res.json("It cannot be deleted")
        }

        const deleteAppointmentById = await Appointment.delete({
            id: deleteById
        })

        return res.json({
            success: true,
            message: "The appointment was successfully deleted.",
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "Unable to delete the appointment, please try again.",
            error
        })
    }
}


const getAllMyAppointment = async (req: Request, res: Response) => {

    try {
        const id = req.token.id

        const appointmentsUser = await Appointment.findBy({
            client_id: id
        })

        const appointmentsUserForShows = await Promise.all(appointmentsUser.map(async (obj) => {
            const { status, worker_id, client_id, ...rest } = obj;
            
            const worker = await User.findOneBy({ 
                id: worker_id 
            });

            if (worker) {
                const email = worker.email;
                const is_active = worker.is_active;
                return { ...rest, email, is_active };
            }
            else {
                return null
            }
        }));

        return res.json({
            success: true,
            message: "Here are all your appointments",
            data: appointmentsUserForShows
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "appointments can't be getted, try again",
            error
        })
    }
}


const getAllArtist = async (req: Request, res: Response) => {

    try {
        const id = req.token.id

        const appointmentsWorker = await Appointment.findBy({
            worker_id: id
        })

        const appointmentsUserForShows = await Promise.all(appointmentsWorker.map(async (obj) => {
            const { status, worker_id, client_id, ...rest } = obj;
            
            const worker = await User.findOneBy({ 
                id: worker_id 
            });

            if (worker) {
                const email = worker.email;
                const is_active = worker.is_active;
                return { ...rest, email, is_active };
            }
            else {
                return null
            }
        }));

        return res.json({
            success: true,
            message: "Here are all your appointments as employee",
            data: appointmentsUserForShows
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "appointments can't be getted, try again",
            error
        })
    }
}

// obtener todas las citas como super admin 
const getallAppointmentDetail = async (req: Request, res: Response) => {
  

    try {
        const id = req.token.id

        const appointmentsUser = await Appointment.find()
 
        const appointmentsUserForShows = await Promise.all(appointmentsUser.map(async (obj) => {
            const { status, worker_id, client_id, ...rest } = obj;
            
            const user = await User.findOneBy({ 
                id: client_id
            });

            if (user) {
                const email = user.email;
                const full_name = user.full_name;
                const is_active = user.is_active;
                return { is_active, email,full_name,...rest,  };
            }
            else {
                return null
            }
        }));

        return res.json({
            success: true,
            message: "Here are all your appointments",
            data: appointmentsUserForShows
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "appointments can't be getted, try again",
            error
        })
    }
}

//obtener la cita a detalle
const getAppointmentDetail = async (req: Request, res: Response) => {
   
}

export { createAppointment, updateAppointment, deleteAppointment,getAllMyAppointment ,getAllArtist, getallAppointmentDetail}