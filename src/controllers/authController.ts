import express from "express";
import { Express, Response, Request } from "express";
import User from "../models/User"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authHash from "../config/authHash";

const router = express.Router();

function generateToken(params = {}){
    return jwt.sign(params, authHash.secret, {
        expiresIn: 86400
    })
}

router.post('/register', async (req: Request, res: Response) => {
    const { email } = req.body;
    
    try{
        if(await User.findOne({ email })) return res.status(400).send({ error: "User already exists" })

        const user = await User.create(req.body);

        user.password = "";

        return res.send({
            user,
            token: generateToken({ id: user.id }),
        });
    } catch(err){
        return res.status(400).send({ error: "Registration failed"})
    }
});

const authController = (app: Express) => {
    app.use('/auth', router);
}

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if(!user) {
        return res.status(400).send({ error: "User not found" });
    }

    if(!await bcrypt.compare(password, user.password)) {
        return res.status(400).send({ error: "Invalid password"});
    }

    user.password = "";

    res.send({ 
        user,
        token:generateToken({ id: user.id }),
    })
});

export default authController;