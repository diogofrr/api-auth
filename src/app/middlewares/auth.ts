import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import authHash from "../../config/authHash.json";

import { TRequestWithUserId } from "../../types/TRequestWithUserId";


const authMiddleware = (req: TRequestWithUserId, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).send({ error: 'No token provided' });
    }

    const parts: string[] = authHeader.split(' ');

    if(!(parts.length === 2)) {
        return res.status(401).send({ error: 'Token error'});
    };

    const [ scheme, token ] = parts;

    if (!/Bearer/i.test(scheme)){
        return res.status(401).send({ error: 'Token malformatted '});
    };

    jwt.verify(token, authHash.secret, (err: any, decoded: any) => {
        if(err || typeof decoded === 'string') {
            return res.status(401).send({ error: 'Token invalid' });
        };
            
        req.userId = decoded.id;
        return next();
    });
};

export default authMiddleware;