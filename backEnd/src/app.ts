import express from "express";
import dotenv from "dotenv"
import router from "./router/router"; 
import type{Request,Response} from "express"
import 'dotenv/config';
import cors from "cors"
const app = express();
app.use(express.json())
app.use(cors())
dotenv.config();

const port = process.env.PORT || 3001;


app.use("/appBarber", router)
app.get("/", (_req: Request, res: Response) => {
  console.log("DATABASE_URL em runtime:", process.env.DATABASE_URL);
  res.send("Backend online ");
});

try {
  app.listen(port, () => {
    console.log(`Servidor Aberto ! ${port}`);
  });
} catch (err) {
  console.error("Erro ao iniciar servidor:", err);
}
