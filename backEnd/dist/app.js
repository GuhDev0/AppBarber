import express from "express";
import dotenv from "dotenv";
import router from "./router/router.js";
import 'dotenv/config';
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
const port = process.env.PORT || 3000;
app.use("/appBarber", router);
app.get("/", (_req, res) => {
    console.log("DATABASE_URL em runtime:", process.env.DATABASE_URL);
    res.send("Backend online 🚀");
});
try {
    app.listen(3000, () => {
        console.log("Servidor Aberto ! 3000");
    });
}
catch (err) {
    console.error("Erro ao iniciar servidor:", err);
}
