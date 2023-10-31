import { Request, Response } from "express"
import { Appointment } from "../models/Appointment"
import { User } from "../models/User";
import { Appointment_portfolio } from "../models/Appointment_portfolio";
import { Portfolio } from "../models/Portfolio";


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
            relations: ["appointmentPortfolios"],
            skip: skip,
            take: pageSize
        })

        const appointmentsUser = await Promise.all(

            getAllMyAppointment.map(async (obj) => {
                const { status, worker_id, client_id, appointmentPortfolios, ...rest } = obj;
                const purchase = obj.appointmentPortfolios.map((obj) => obj.name)
                const categoryPortfolio = obj.appointmentPortfolios.map((obj) => obj.category)

                const getWorker = await User.findOneBy({
                    id: worker_id
                });

                if (getWorker) {
                    const full_name = getWorker.full_name
                    const email = getWorker.email;
                    const is_active = getWorker.is_active;
                    const name = purchase[0]
                    const category = categoryPortfolio[0]
                    return { full_name, email, name,category, is_active, ...rest };
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
        const date = req.body.date
        const shift = req.body.shift
        const email = req.body.email
        const   purchase = req.body.name
        const idToken = req.token.id

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

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
                id: createNewAppointment.id,
                purchase: portfolio?.name,
                price: portfolio?.price,
                category:portfolio?.category,
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

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (!email) {
            return res.json({
                success: true,
                message: "you must insert an email",
            })
        }

        if (typeof (email) !== "string") {
            return res.json({
                success: true,
                mensaje: 'email incorrect, you can put only strings, try again'
            });
        }

        if (email.length > 100) {
            return res.json({
                success: true,
                mensaje: 'name too long, try to insert a shorter name, max 100 characters'
            });
        }

        if (!emailRegex.test(email)) {
            return res.json({
                success: true,
                mensaje: 'email format incorrect, try again'
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

        if (!id) {
            return res.json({
                success: true,
                message: "you must insert an id",
            })
        }

        if (typeof (id) !== "number") {
            return res.json({
                success: true,
                mensaje: "id incorrect, you can put only numbers, try again"
            });
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

        if (!name) {
            return res.json({
                success: true,
                message: "you must insert an name",
            })
        }

        if (typeof (name) !== "string") {
            return res.json({
                success: true,
                mensaje: 'name incorrect, you can put only strings, try again'
            });
        }

        if (name.length == 0) {
            return res.json({
                success: true,
                mensaje: 'name too short, try to insert a larger name, max 100 characters'
            });
        }

        if (name.length > 100) {
            return res.json({
                success: true,
                mensaje: 'name too long, try to insert a shorter name, max 100 characters'
            });
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
            portfolio_id:namePortfolio?.id  
        }) 

        const appointmentUpdated = await Appointment.findOneBy({
            id: id
        })

        const portfolio= await Portfolio.findOneBy({
            name
        })

        return res.json({
            success: true,
            message: "Appointment created succesfully",
            data: {
                date,
                shift,
                email,
                id: id,
                name,
                category: portfolio?.category,
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
                    return { user_email, user_name, is_active ,name,category,...rest };
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
                const { worker_id, client_id,appointmentPortfolios, ...rest } = obj;
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
                    return { is_active, user_email, user_name, worker_email, worker_name,name,category ,...rest, };
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
            where: { id: appointment_id },
            relations: ["appointmentPortfolios"]
        })

        const appointmentsUser = await Promise.all(
            getAllMyAppointment.map(async (obj) => {
                const { status, worker_id, client_id, appointmentPortfolios, ...rest } = obj;
                const purchase = obj.appointmentPortfolios.map((obj) => obj.name)

                const getWorker = await User.findOneBy({
                    id: worker_id
                });

                const getUser = await User.findOneBy({
                    id: client_id
                });

                if (getWorker && getUser) {
                    const worker_name = getWorker.full_name
                    const worker_email = getWorker.email;
                    const is_active = getWorker.is_active;
                    const name = purchase[0]
                    const client_id = getUser.full_name
                    const client_email = getUser.email
                    return { worker_name, worker_email, name, is_active, client_id, client_email, ...rest };
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
        const idToken = req.token.id
        const appointment_id = req.body.id
        const date = req.body.date
        const shift = req.body.shift

        const getAllMyAppointment = await Appointment.find({
            where: { id: appointment_id },
            relations: ["appointmentPortfolios"]
        })

        const appointmentsUser = await Promise.all(
            getAllMyAppointment.map(async (obj) => {
                const { status, worker_id, client_id, appointmentPortfolios, ...rest } = obj;
                const purchase = obj.appointmentPortfolios.map((obj) => obj.name)

                const getWorker = await User.findOneBy({
                    id: worker_id
                });

                const getUser = await User.findOneBy({
                    id: client_id
                });

                if (getWorker && getUser) {
                    const worker_name = getWorker.full_name
                    const worker_email = getWorker.email;
                    const is_active = getWorker.is_active;
                    const name = purchase[0]
                    const client_id = getUser.full_name
                    const client_email = getUser.email
                    return { worker_name, worker_email, name, is_active, client_id, client_email, ...rest };
                }
                else {
                    return null
                }
            })
        );

        const appointmentDetail = appointmentsUser.find(obj => obj?.date === date && obj?.shift === shift);

        if (appointmentDetail?.date  == date && appointmentDetail?.shift == shift) { 
            return res.json({
                success: true,
                message: "The appointment is not available, try a different date or shift" 
            });
        }
 
        return res.json({
            success: true,
            message: "Appointment available" 
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "Appointments cannot be retrieved, please try again.",
            error
        })
    }
}

  



export { createAppointment, updateAppointment, deleteAppointment, getAllMyAppointment, getAllArtist, getallAppointmentSuperAdmin, getAppointmentDetail,appointmentValidation }