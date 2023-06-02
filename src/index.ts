import express from "express";
// import index from './app/controllers/';
import { config } from "dotenv";

import authController from "./app/controllers/authController";
import projectController from "./app/controllers/projectController";

config();

const porta: number | string = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.URL);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.listen(porta, () => {
    console.log(`O servidor está ouvindo na porta ${porta}.`)
});

authController(app);
projectController(app);
