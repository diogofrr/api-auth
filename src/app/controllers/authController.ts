import express from "express";
import { Express, Response, Request } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";

import { HbsTransporter } from "nodemailer-express-handlebars";

import User from "../models/User"
import authHash from "../../config/authHash.json";
import mailer from "../../modules/mailer"

const router = express.Router();

function generateToken(params = {}){
    return jwt.sign(params, authHash.secret, {
        expiresIn: 86400
    });
};

router.post("/register", async (req: Request, res: Response) => {
    const { email } = req.body;
    
    try{
        if(await User.findOne({ email })) return res.status(400).send({
            error: true,
            status: "User already exists",
        })

        const user = await User.create(req.body);

        user.password = "";

        return res.status(200).send({
            error: false,
            status: "Successfully registered",
            user,
            token: generateToken({ id: user.id }),
        });
    } catch(err){
        return res.status(400).send({
            error: true,
            status: "Registration failed"
        })
    }
});

const authController = (app: Express) => {
    app.use("/auth", router);
}

router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if(!user) {
        return res.status(400).send({
            error: true,
            status: "User not found",
        });
    }

    if(!await bcrypt.compare(password, user.password)) {
        return res.status(400).send({
            error: true,
            status: "Invalid password",
        });
    }

    user.password = "";

    res.status(200).send({
        error: false,
        status: "Connected successfully",
        user,
        token:generateToken({ id: user.id }),
    });
});

router.post("/forgot_password", async (req: Request, res: Response) => {
    const { email }: { email: string } = req.body;

    try {
        const user = await User.findOne({ email });

        if(!user) {
            return res.status(400).send({
                error: true,
                status: "User not found"
            });
        }

        const token = crypto.randomBytes(20).toString("hex");

        const now = new Date();
        now.setHours(now.getHours() + 1);
        
        await User.findByIdAndUpdate(user.id, {
            "$set":{
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        });

        const mailerHbs: HbsTransporter = mailer as HbsTransporter;

        mailerHbs.sendMail({
            to: email,
            from: "contadeatividades9199@gmail.com",
            template: "auth/forgot_password",
            context: { token },
        }, (err) => {
            if(err){
                console.log(err);

                return res.status(400).send({
                    error: true,
                    status: "Error on forgot password, try again",
                })
            }

            return res.status(200).send({
                error: false,
                status: "Email successfully sent",
            });
        });

    } catch(err) {
        console.log(err);

        res.status(400).send({
            error: true,
            status: "Error on forgot password, try again",
        })
    }
});

router.post("/reset_password", async (req: Request, res: Response) => {
    const { email, token, password } = req.body;
    
    try {
        const user = await User.findOne({ email })
            .select("+passwordResetToken passwordResetExpires");
        
        if (!user) {
            return res.status(400).send({
                error: true,
                status: "User not found",
            });
        }

        if (token !== user.passwordResetToken) {
            return res.status(400).send({
                error: true,
                status: "Token invalid",
            });
        }

        const now = new Date();

        if(user.passwordResetExpires !== undefined && now > user.passwordResetExpires){
            return res.status(400).send({
                error: true,
                status: "Token expired, generate a new one",
            });
        }

        user.password = password;

        await user.save();

        res.status(200).send({
            error: false,
            status: "Password changed successfully"
        });
    } catch (err) {
        res.status(400).send({
            error: true,
            status: "Cannot reset password, try again",
        })
    }
});

export default authController;