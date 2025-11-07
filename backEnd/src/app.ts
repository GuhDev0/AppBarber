import express from "express";
import dotenv from "dotenv"
import router from "./router/router.js"; 
import type{Request,Response} from "express"
import 'dotenv/config';
import cors from "cors"
const app = express();
app.use(express.json())
app.use(cors())
dotenv.config();

const port = process.env.PORT || 3000;

app.use("/appBarber", router)
app.get("/", (_req: Request, res: Response) => {
  res.send("Backend online 🚀");
});

app.listen(port, () =>{
    
    console.log(`Servidor Aberto ! ${port}`)
})