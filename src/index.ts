import express from "express";
import authController from "./controllers/authController";
import projectController from "./controllers/projectController";

const porta: number = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(porta, () => {
    console.log(`O servidor está ouvindo na porta ${porta}.`)
});

authController(app);
projectController(app);