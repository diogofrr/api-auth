import express from "express";
import index from './app/controllers/index';

const porta: number = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(porta, () => {
    console.log(`O servidor está ouvindo na porta ${porta}.`)
});

index(app);