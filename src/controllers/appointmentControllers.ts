import { Request, Response } from "express"
import { Appointment } from "../models/Appointment"
import { User } from "../models/User";
import { Appointment_portfolio } from "../models/Appointment_portfolio";
import { Portfolio } from "../models/Portfolio";
const { validateEmail, validateDate, validateShift, validateString, validateAvailableDate, validateNumber } = require('../validations/validations');


const getAllMyAppointment = async (req: Request, res: Response) => {

    try {
        const idToken = req.token.id

        if (typeof (req.query.skip) !== "string") {
            return res.json({
                success: true,
                message: "skip it's not string."
            })
        }

        if (typeof (req.query.page) !== "string") {
            return res.json({
                success: true,
                message: "page it's not string."
            })
        }

        const pageSize = parseInt(req.query.skip as string) || 5
        const page: any = parseInt(req.query.page as string) || 1
        const skip = (page - 1) * pageSize

        const getAllMyAppointment = await Appointment.find({
            where: { client_id: idToken },
            relations: ["appointmentPortfolios", "worker"],
            skip: skip,
            take: pageSize
        })

        const appointmentsUser = await Promise.all( 
            getAllMyAppointment.map(async (obj) => {
                const { status, worker_id, client_id, appointmentPortfolios, worker, ...rest } = obj;
                const purchase = obj.appointmentPortfolios.map((obj) => obj.name)
                const categoryPortfolio = obj.appointmentPortfolios.map((obj) => obj.category)
                const getWorker = obj.worker

                if (getWorker && (categoryPortfolio.length !== 0) && (purchase.length !== 0)) {
                    const full_name = getWorker.full_name
                    const email = getWorker.email;
                    const is_active = getWorker.is_active;
                    const name = purchase[0]
                    const category = categoryPortfolio[0]
                    return { full_name, email, name, category, is_active, ...rest };
                }
                else {
                    return null
                }
            })
        );

        return res.json({
            success: true,
            message: "Here is a list of all your appointments.",
            data: appointmentsUser
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "Appointments cannot be retrieved, please try again.",
            error
        })
    }
}

const createAppointment = async (req: Request, res: Response) => {

    try {
        const idToken = req.token.id
        const { date, shift, email, name: purchase } = req.body

        if (validateDate(date)) {
            return res.json({ success: true, message: validateDate(date) });
        }

        if (validateShift(shift)) {
            return res.json({ success: true, message: validateShift(shift) });
        }

        if (validateString(purchase, 100)) {
            return res.json({ success: true, message: validateString(purchase, 100) });
        }

        if (validateEmail(email)) {
            return res.json({ success: true, message: validateEmail(email) });
        }

        const validationResult = await validateAvailableDate(date, email, shift);
        if (!validationResult.isValid) {
            return res.json({
                success: true,
                isValid: validationResult.isValid,
                message: validationResult.message
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

        const findPurchase = await Portfolio.find()

        const mapping = findPurchase.map((obj) => obj.name)

        if (!mapping.includes(purchase)) {
            return res.json({
                success: true,
                message: "the name of the item purchase doesn't exist",
            })
        }

        const createNewAppointment = await Appointment.create({
            date,
            shift,
            worker_id: findWorkerByEmail.id,
            client_id: idToken
        }).save()

        const portfolio = await Portfolio.findOneBy({
            name: purchase
        })

        await Appointment_portfolio.create({
            appointment_id: createNewAppointment.id,
            portfolio_id: portfolio?.id
        }).save()

        return res.json({
            success: true,
            message: "Appointment created successfully",
            data: {
                date: createNewAppointment.date,
                shift: createNewAppointment.shift,
                email: email,
                worker: findWorkerByEmail?.full_name,
                id: createNewAppointment.id,
                purchase: portfolio?.name,
                price: portfolio?.price,
                category: portfolio?.category,
                created_at: createNewAppointment.created_at,
                updated_at: createNewAppointment.updated_at
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
        const { id, date, shift, email, name } = req.body

        if (validateNumber(id, 10)) {
            return res.json({ success: true, message: validateNumber(id) });
        }
        if (validateDate(date)) {
            return res.json({ success: true, message: validateDate(date) });
        }

        if (validateShift(shift)) {
            return res.json({ success: true, message: validateShift(shift) });
        }

        if (validateString(name, 50)) {
            return res.json({ success: true, message: validateString(name, 100) });
        }

        if (validateEmail(email)) {
            return res.json({ success: true, message: validateEmail(email) });
        }

        const validationResult = await validateAvailableDate(date, email, shift);
        if (!validationResult.isValid) {
            return res.json({
                success: true,
                isValid: validationResult.isValid,
                message: validationResult.message
            });
        }

        const findWorker_id = await User.findOneBy({
            email
        })

        if (findWorker_id?.is_active !== true) {
            return res.json({
                success: true,
                message: "this worker not exist"
            })
        }

        const worker_id = findWorker_id?.id

        const appointmentsClient = await Appointment.findBy({
            client_id,
        })

        const mapping = await appointmentsClient.map((object) =>
            object.id
        )

        if (!mapping.includes(id)) {
            return res.json({
                success: true,
                message: "appointment updated not succesfully, incorrect id"
            })
        }

        const getPurchaseItems = await Portfolio.find()
        const mapPortfolio = getPurchaseItems.map((obj) => obj.name)

        if (!mapPortfolio.includes(name)) {
            return res.json({
                success: true,
                message: "the name of the item purchase doesn't exist",
            })
        }

        const namePortfolio = await Portfolio.findOneBy({
            name
        })

        await Appointment.update({
            id: id
        }, {
            date,
            shift,
            worker_id
        })

        await Appointment_portfolio.update({
            appointment_id: id
        }, {
            portfolio_id: namePortfolio?.id
        })

        const appointmentUpdated = await Appointment.findOneBy({
            id: id
        })

        return res.json({
            success: true,
            message: "Appointment created succesfully",
            data: {
                date,
                shift,
                Worker: findWorker_id?.full_name,
                email,
                id: id,
                name,
                category: namePortfolio?.category,
                created_at: appointmentUpdated?.created_at,
                updated_at: appointmentUpdated?.updated_at
            }
        })
    } catch (error) {
        return res.json({
            success: false,
            message: "Appointment can't be updated, try again",
            error
        })
    }
}

const deleteAppointment = async (req: Request, res: Response) => {
    try {
        const deleteById = req.body.id
        const idToken = req.token.id

        if (validateNumber(deleteById, 10)) {
            return res.json({ success: true, message: validateNumber(deleteById, 10) });
        }

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
            client_id: idToken
        })

        const appointments_id = getUser.map((appointment) =>
            appointment.id
        )

        if (!appointments_id.includes(deleteById)) {
            return res.json({
                success: true,
                message: "It cannot be deleted"
            })
        }

        await Appointment.delete({
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

        if (typeof (req.query.skip) !== "string") {
            return res.json({
                success: true,
                message: "skip it's not string."
            })
        }

        if (typeof (req.query.page) !== "string") {
            return res.json({
                success: true,
                message: "page it's not string."
            })
        }

        const pageSize = parseInt(req.query.skip as string) || 5
        const page: any = parseInt(req.query.page as string) || 1
        const skip = (page - 1) * pageSize

        const appointmentsWorker = await Appointment.find({
            where: { worker_id: id },
            relations: ["appointmentPortfolios"],
            skip: skip,
            take: pageSize
        })

        const appointmentsWorkers = await Promise.all(appointmentsWorker
            .filter((obj) => obj.status === false)
            .map(async (obj) => {
                const { worker_id, client_id, appointmentPortfolios, ...rest } = obj;
                const purchase = obj.appointmentPortfolios.map((obj) => obj.name)
                const categoryPortfolio = obj.appointmentPortfolios.map((obj) => obj.category)

                const user = await User.findOneBy({
                    id: client_id
                });

                if (user) {
                    const user_email = user.email;
                    const user_name = user.full_name
                    const is_active = user.is_active;
                    const name = purchase[0]
                    const category = categoryPortfolio[0]
                    return { user_email, user_name, is_active, name, category, ...rest };
                }
                else {
                    return null
                }
            }));

        if (appointmentsWorkers.length == 0) {
            return res.json({
                success: true,
                message: "This worker has no appointments",
            });
        }

        return res.json({
            success: true,
            message: "Here are all your appointments as employee",
            data: appointmentsWorkers
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "appointments can't be getted, try again",
            error
        })
    }
}

const getallAppointmentSuperAdmin = async (req: Request, res: Response) => {
    try {

        if (typeof (req.query.skip) !== "string") {
            return res.json({
                success: true,
                message: "skip it's not string."
            })
        }

        if (typeof (req.query.page) !== "string") {
            return res.json({
                success: true,
                message: "page it's not string."
            })
        }

        const pageSize = parseInt(req.query.skip as string) || 5
        const page: any = parseInt(req.query.page as string) || 1
        const skip = (page - 1) * pageSize

        const appointmentsUser = await Appointment.find({
            relations: ["appointmentPortfolios"],
            skip: skip,
            take: pageSize
        })

        const appointmentsAll = await Promise.all(appointmentsUser
            .map(async (obj) => {
                const { worker_id, client_id, appointmentPortfolios, ...rest } = obj;
                const purchase = obj.appointmentPortfolios.map((obj) => obj.name)
                const categoryPortfolio = obj.appointmentPortfolios.map((obj) => obj.category)

                const user = await User.findOneBy({
                    id: client_id
                });

                const worker = await User.findOneBy({
                    id: worker_id
                });

                if (user && worker) {
                    const user_email = user.email;
                    const user_name = user.full_name;
                    const is_active = user.is_active;
                    const worker_email = worker.email;
                    const worker_name = worker.full_name;
                    const name = purchase[0]
                    const category = categoryPortfolio[0]
                    return { is_active, user_email, user_name, worker_email, worker_name, name, category, ...rest, };
                }
                else {
                    return null
                }
            }));

        if (appointmentsAll.length == 0) {
            return res.json({
                success: true,
                message: "This shop currently has no available appointments.",
            });
        }

        return res.json({
            success: true,
            message: "Here are all your appointments",
            data: appointmentsAll
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "appointments can't be getted, try again",
            error
        })
    }
}

const getAppointmentDetail = async (req: Request, res: Response) => {
    try {
        const idToken = req.token.id
        const appointment_id = req.body.id

        const getAllMyAppointment = await Appointment.find({
            where: { client_id: idToken },
            relations: ["appointmentPortfolios"]
        })

        const appointmentsUser = await Promise.all(
            getAllMyAppointment.map(async (obj) => {
                const { status, worker_id, client_id, appointmentPortfolios, ...rest } = obj;
                const purchase = obj.appointmentPortfolios.map((obj) => obj.name)

                const getWorker = await User.findOneBy({
                    id: worker_id
                });

                if (getWorker) {
                    const worker_name = getWorker.full_name
                    const worker_email = getWorker.email;
                    const is_active = getWorker.is_active;
                    const name = purchase[0]
                    return { worker_name, worker_email, name, is_active, ...rest };
                }
                else {
                    return null
                }
            })
        );

        if (!getAllMyAppointment) {
            return res.json({
                success: true,
                message: "you must insert an id",
            })
        }

        if (getAllMyAppointment.length === 0) {
            return res.json({
                success: true,
                message: "Appointment not found",
            })
        }

        const appointmentDetail = appointmentsUser.find(obj => obj?.id === appointment_id);

        if (appointmentDetail == null) {
            return res.json({
                success: true,
                message: "appointment id incorrect, try again",
            });
        }

        return res.json({
            success: true,
            message: "Here is a list of all your appointments.",
            data: appointmentDetail
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "Appointments cannot be retrieved, please try again.",
            error
        })
    }
}

const appointmentValidation = async (req: Request, res: Response) => {
    try {
        const { date, email: emailWorker, shift } = req.body
        const idToken = req.token.id

        if (validateEmail(emailWorker)) {
            return res.json({ success: true, message: validateEmail(emailWorker) });
        }

        if (validateDate(date)) {
            return res.json({ success: true, message: validateDate(date) });
        }

        if (validateShift(shift)) {
            return res.json({ success: true, message: validateShift(shift) });
        }

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        const todayFormatDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        if (todayFormatDate > date) {
            return res.json({
                success: true,
                message: "This appointment is in the past. Please reschedule."
            });
        }

        const findWorker = await User.findOneBy({
            email: emailWorker
        })

        if (findWorker?.role_id !== 2) {
            return res.json({
                success: true,
                message: "Worker not found, try again."
            });
        }

        const allAppointments = await Appointment.findOneBy({
            date,
            shift,
            worker_id: findWorker?.id
        })

        if (!allAppointments) {
            return res.json({
                success: true,
                message: "This appointment not exist"
            });
        }

        const client_id = allAppointments?.client_id

        if (idToken !== client_id) {
            return res.json({
                success: true,
                message: "this appointment it`s not yours"
            });
        }

        return res.json({
            success: true,
            message: "this appointment is yours and has been validated successfully"
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "Appointments cannot be retrieved, please try again.",
            error
        })
    }
}

export { createAppointment, updateAppointment, deleteAppointment, getAllMyAppointment, getAllArtist, getallAppointmentSuperAdmin, getAppointmentDetail, appointmentValidation }