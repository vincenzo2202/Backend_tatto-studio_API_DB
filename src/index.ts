import express from "express";
import { usersRoutes } from "./routes/usersRoutes";

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use("/", usersRoutes);


app.listen(PORT,()=>{
    console.log(`Server Running on: ${PORT}`);
})