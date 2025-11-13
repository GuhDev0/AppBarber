"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const router_1 = __importDefault(require("./router/router"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
dotenv_1.default.config();
const port = process.env.PORT || 3000;
app.use("/appBarber", router_1.default);
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
