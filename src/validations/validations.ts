// validation.js

import { Appointment } from "../models/Appointment";
import { User } from "../models/User";

const validateDate = (date: string) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!date) {
        return "you must insert a date"
    }

    if (typeof (date) !== "string") {
        return "date incorrect, you can put only strings, try again"
    };

    if (!dateRegex.test(date)) {
        return "date incorrect, The date format should be YYYY-MM-DD, try again"
    };
};

const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!email) {
        return "you must insert an email"
    }

    if (typeof (email) !== "string") {
        return 'Incorrect email, it should only contain strings'
    };

    if (email.length > 100) {
        return 'Email is too long, please try a shorter one. Maximum 100 characters'
    };

    if (!emailRegex.test(email)) {
        return 'Incorrect email format. Please try again'
    };
};

const validateString = (string: string, length: number) => {
    if (!string) {
        return "you must insert an name " + string
    }

    if (typeof (string) !== "string") {
        return `you must insert a strings`
    };

    if (string.length == 0) {
        return `${string} too short, try to insert a larger one, max  ${length} characters`
    };

    if (string.length > length) {
        return `${string} too long, try to insert a shorter one, max ${length} characters`
    }
};

const validateShift = (shift: string) => {
    if (!shift) {
        return "you must insert a shift"
    }

    if (typeof (shift) !== "string") {
        return "shift incorrect, you can put only strings, try again"
    };

    if (shift !== "morning" && shift !== "afternoon") {
        return "shift incorrect, you only can put morning or afternoon, try again"
    };
};

const validateAvailableDate = async (date: string, emailWorker: string, shift: string, idToken: number) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate() + 1;

    const todayFormatDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    if (todayFormatDate > date) {
        return {
            isValid: false,
            message: "this day is prior to the current day, try again."
        };
    }

    const findAppointmentWorker = await Appointment.find({
        where: {
            date,
            shift,
        },
        relations: ["worker"],
    })

    let isValid = true;

    findAppointmentWorker.forEach(appointment => {
        if (appointment.worker.role_id !== 2 ||
            appointment.date === date && appointment.shift === shift &&
            appointment.worker.email === emailWorker) {
            isValid = false;
        }
    });

    if (!isValid) {
        return {
            isValid: false,
            message: "this appointment it's not available, try again"
        };
    }
    return { isValid: true };
};

const validateNumber = (number: number, length: number) => {

    if (!number) {
        return "you must insert an number "
    }

    if (typeof (number) !== "number") {
        return `you must insert a number`
    };

    const toString = number.toString()

    if (toString.length > length) {
        return `number too long, max ${length},try again`
    }
};
const validatePassword = (password: string) => {

    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{4,12}$/;

    if (!password) {
        return {
            success: true,
            mensaje: 'You must insert a password'
        };
    }

    if (typeof (password) !== "string") {
        return {
            success: true,
            mensaje: 'Password is incorrect; only strings are allowed. Please try again'
        };
    }

    if (password.length > 100) {
        return {
            success: true,
            mensaje: 'Password is too long. Please insert a shorter password (maximum 100 characters).'
        };
    }

    if (!passwordRegex.test(password)) {
        return {
            success: true,
            mensaje: 'Password is incorrect. Please try again'
        };
    }



};

const validateId = (id: number, length: number) => {

    if (!id) {
        return "you must insert an number "
    }

    if (typeof (id) !== "number") {
        return `you must insert a number`
    };

    const toString = id.toString()

    if (toString.length > length) {
        return `number too long, max ${length},try again`
    }
};

const validatePhoto = (string: string, length: number) => {
    if (string != undefined) {
 
        if (!string) {
            return "you must insert an name " + string
        }

        if (typeof (string) !== "string") {
            return `you must insert a strings`
        };


        if (string.length == 0) {
            return `${string} too short, try to insert a larger one, max  ${length} characters`
        };

        if (string.length > length) {
            return `${string} too long, try to insert a shorter one, max ${length} characters`
        }
    }
};


module.exports = {
    validateEmail,
    validateDate,
    validateShift,
    validateString,
    validateAvailableDate,
    validateNumber,
    validatePassword,
    validateId,
    validatePhoto
};