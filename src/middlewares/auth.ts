import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import authHash from "../config/authHash";

type RequestWithUserId = Request & {
    userId?: string | JwtPayload,
};

const authMiddleware = (req: RequestWithUserId, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).send({ error: 'No token provided' });
    }

    const parts: string[] = authHeader.split(' ');

    if(!(parts.length === 2)) {
        return res.status(401);
    };

    const [ scheme, token ] = parts;

    if (!/^Bearer$/i.test(scheme)){
        return res.status(401).send({ error: 'Token malformatted '});
    };

    jwt.verify(token, authHash.secret, (err, decoded) => {
        if(err) {
            return res.status(401).send({ error: 'Token invalid' });
        };

        // req.userId = decoded.id;
    });
};

export default authMiddleware;