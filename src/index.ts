import express from "express"; 
import { AppDataSource } from "./db";
import { userRoutes } from "./routes/usersRoutes";

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())
app.use("/user", userRoutes)

AppDataSource.initialize()
.then(() => {
    console.log('Database connected');
    app.listen(PORT, ()=>{
        console.log("running server on " + PORT);
    })
    })
    .catch(error => {
        console.log(error);
    });