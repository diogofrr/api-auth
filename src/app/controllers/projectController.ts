import express from "express";
import { Express, Response, Request } from "express";
import authMiddleware, { RequestWithUserId } from "../middlewares/auth";

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req: RequestWithUserId, res: Response) => {
    res.send({ ok: true, user: req.userId });
});

const projectController = (app: Express) => {
    app.use('/projects', router);
};

export default projectController;