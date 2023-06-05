import express from "express";
import cors from "cors";
// import index from './app/controllers/';
import { config } from "dotenv";

import authController from "./app/controllers/authController";
import projectController from "./app/controllers/projectController";

config();

const porta: number | string = process.env.PORT || 3000;

const app = express();

const corsOptions = {
    origin: process.env.APP_URL,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(porta, () => {
    console.log(`O servidor está ouvindo na porta ${porta}.`)
});

authController(app);
projectController(app);
