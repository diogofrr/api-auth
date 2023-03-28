import { Request } from "express"
import { JwtPayload } from "jsonwebtoken";

export type TRequestWithUserId = Request & {
    userId?: string | JwtPayload,
};