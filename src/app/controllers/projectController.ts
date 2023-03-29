import express from "express";
import authMiddleware from "../middlewares/auth";
import { TRequestWithUserId } from "../../types/TRequestWithUserId";

import { Express, Response, Request } from "express";

import Project from "../models/Project";
import Task from "../models/Task";

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req: Request, res: Response) => {
    try {
        const projects = await Project.find().populate(['user', 'tasks']);

        return res.send({ projects });
    } catch (err) {
        return res.status(400).send({
            error: true,
            status: 'Error loading projects',
        });
    }
});

router.get('/:projectId', async (req: TRequestWithUserId, res: Response) => {
    try {
        const project = await Project.findById(req.params.projectId).populate(['user', 'tasks']);

        return res.send({ project });
    } catch (err) {
        return res.status(400).send({
            error: true,
            status: 'Error loading project',
        });
    }
});

router.post('/', async (req: TRequestWithUserId, res: Response) => {
    try {
        const { title, description, tasks } = req.body;
        
        if ((!/.+/si.test(title)) || (!/.+/i.test(description))){
            return res.status(400).send({
                error: true,
                status: 'Invalid data'
            });
        };
        
        const project: any = await Project.create({ title, description, user: req.userId });

        await Promise.all(tasks.map(async (task: any)  => {
            const projectTask = new Task({ ...task, project: project._id });

            await projectTask.save();

            project.tasks.push(projectTask);
        }));

        await project.save();

        return res.send({
            error: false,
            project
        });
    } catch (err) {
        return res.status(400).send({
            error: true,
            status: 'Error creating new project',
        });
    }
});

router.put('/:projectId', async (req: TRequestWithUserId, res: Response) => {
    try {
        const { title, description, tasks } = req.body;
        
        if ((!/.+/si.test(title)) || (!/.+/i.test(description))){
            return res.status(400).send({
                error: true,
                status: 'Invalid data'
            });
        };

        const project: any = await Project.findByIdAndUpdate(req.params.projectId, { title, description }, { new: true });

        if(project) {
            project.tasks = [];
            await Task.deleteOne({ project: project._id });   

            await Promise.all(tasks.map(async (task: any)  => {
                const projectTask: any = new Task({ ...task, project: project._id });

                await projectTask.save();

                project.tasks.push(projectTask);
            }));

            await project.save();
        }
        return res.status(200).send({
            error: false,
            status: 'Successfully updated',
            project,
        });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ 
            error: true,
            status: 'Error a update project',
        });
    }
});

router.delete('/:projectId', async (req: TRequestWithUserId, res: Response) => {
    try {
        await Project.findByIdAndRemove(req.params.projectId);

        return res.status(200).send({ 
            error: false,
            status: 'Successfully removed',
        });
    } catch (err) {
        return res.status(400).send({
            error: true,
            status: 'Error deleting project',
        });
    }
});

const projectController = (app: Express) => {
    app.use('/projects', router);
};

export default projectController;
