import express from "express";
import 'dotenv/config';
import { AppDataSource } from "./db";
import { userRoutes } from "./routes/usersRoutes";
import { appointmentRoutes } from "./routes/appointmentRoutes";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors())
app.use("/user", userRoutes);
app.use("/appointment", appointmentRoutes);

AppDataSource.initialize()
    .then(() => {
        console.log('Database connected');
        app.listen(PORT, () => {
            console.log("running server on " + PORT);
        });
    })
    .catch(error => {
        console.log(error);
    });