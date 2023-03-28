import express from "express";
import index from './app/controllers/index.ts';
import { config } from "dotenv";

config();

const porta: number | string = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(porta, () => {
    console.log(`O servidor está ouvindo na porta ${porta}.`)
});

index(app);
