import express, { application } from "express";
import { Express, Response, Request } from "express";

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.send({ ok: true });
});

const projectController = (app: Express) => {
    app.use('/projects', router);
};

export default projectController;