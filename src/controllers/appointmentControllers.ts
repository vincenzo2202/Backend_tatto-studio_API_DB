import { Request, Response } from "express"
import { Appointment } from "../models/Appointment"
import { User } from "../models/User";
import { Appointment_portfolio } from "../models/Appointment_portfolio";
import { Portfolio } from "../models/Portfolio";
 

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
                const full_name = worker.full_name
                const is_active = worker.is_active;
                //meter productos del portfolio
                return { ...rest, email, full_name, is_active };
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
//check
const createAppointment = async (req: Request, res: Response) => {

    try {
        const date = req.body.date
        const shift = req.body.shift
        const email = req.body.email
        const purchase = req.body.name
        const idToken = req.token.id

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if (!email) {
            return res.json({
                success: true,
                message: "you must insert an email",
            })
        }

        if (email.length == 0) {
            return res.json({
                success: true,
                mensaje: 'name too short, try to insert a larger name, max 100 characters'
            });
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


        if (findWorkerByEmail?.is_active !== true) {
            return res.json({
                success: true,
                message: "this worker not exist"
            })
        }

        if (findWorkerByEmail?.role.role_name != "admin") {
            return res.json({
                success: true,
                message: "sorry, this user isn't a worker, try again"
            })
        }

        if (idToken == findWorkerByEmail.id) {
            return res.json({
                success: true,
                message: "sorry, you can't create a appointment with yourself"
            })
        }

        if (!date) {
            return res.json({
                success: true,
                message: "you must insert a date",
            })
        }

        if (typeof (date) !== "string") {
            return res.json({
                success: true,
                mensaje: "date incorrect, you can put only strings, try again"
            });
        }

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (!dateRegex.test(date)) {
            return res.json({
                success: true,
                mensaje: "date incorrect, The date format should be YYYY-MM-DD, try again"
            });
        }

        if (!shift) {
            return res.json({
                success: true,
                message: "you must insert a shift",
            })
        }

        if (typeof (shift) !== "string") {
            return res.json({
                success: true,
                mensaje: "shift incorrect, you can put only strings, try again"
            });
        }

        if (shift !== "morning" && shift !== "afternoon") {
            return res.json({
                success: true,
                mensaje: "shift incorrect, you only can put morning or afternoon, try again"
            });
        }
       
        if (!purchase) {
            return res.json({
                success: true,
                message: "you must insert an name",
            })
        }

        if (typeof (purchase) !== "string") {
            return res.json({
                success: true,
                mensaje: 'name incorrect, you can put only strings, try again'
            });
        }

        if (purchase.length == 0) {
            return res.json({
                success: true,
                mensaje: 'name too short, try to insert a larger name, max 100 characters'
            });
        }

        if (purchase.length > 100) {
            return res.json({
                success: true,
                mensaje: 'name too long, try to insert a shorter name, max 100 characters'
            });
        }

        const getPurchaseItems = await Portfolio.find()

        const mapPortfolio = getPurchaseItems.map((obj)=>obj.name)

        if(!mapPortfolio.includes(purchase)){
            return res.json({
                success: true,
                message: "the name of the item purchase doesn't exist",
            })
        }

 
        const createAppointment = await Appointment.create({
            date,
            shift,
            worker_id: findWorkerByEmail.id,
            client_id: idToken
        }).save()

        const portfolio = await Portfolio.findOneBy({
            name: purchase
        })

        const purchaseAppointment = await Appointment_portfolio.create({
            appointment_id: createAppointment.id,
            portfolio_id: portfolio?.id
        }).save()


        return res.json({
            success: true,
            message: "Appointment created successfully",
            data: {
                date: createAppointment.date,
                shift: createAppointment.shift,
                email: email,
                id: createAppointment.id,
                purchase: portfolio?.name,
                price: portfolio?.price,
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
        const shift = body.shift
        const email = body.email

        //regex de correo, fecha y hora
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        const shiftRegex = /^\d{2}:\d{2}:\d{2}$/;

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

        if (findWorkerByEmail?.is_active !== true) {
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

        if (!shift) {
            return res.json({
                success: true,
                message: "you must insert an email",
            })
        }

        //validacion de la hora
        if (typeof (shift) !== "string") {
            return res.json({
                success: true,
                mensaje: "shift incorrect, you can only use strings"
            });
        }

        //validacion de la hora formato regex
        if (!shiftRegex.test(shift)) {
            return res.json({
                success: true,
                mensaje: "shift incorrect, The shift format should be HH:MM:SS, please try again."
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
                shift: shift,
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
                shift,
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
//check
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
const getallAppointmentSuperAdmin = async (req: Request, res: Response) => {


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
                return { is_active, email, full_name, ...rest, };
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

export { createAppointment, updateAppointment, deleteAppointment, getAllMyAppointment, getAllArtist, getallAppointmentSuperAdmin }