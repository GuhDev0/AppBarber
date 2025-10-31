import express from "express";
import dotenv from "dotenv"
import router from "./router/router.js"; 

import cors from "cors"
const app = express();
app.use(express.json())
app.use(cors())
dotenv.config();

const port = 3003;

app.use("/appBarber", router)

app.listen(port, () =>{
    console.log(`Servidor Aberto ! ${port}`)
})