import { GenericRequest } from "@fullstack-todo/types";
import { IUserData, verifyToken } from "../auth";

export function extractUserDataFromRequest(req: GenericRequest) : IUserData | null {
    
    const token = req.headers.get('authorization')?.split(' ')[1] || false;

    if (!token) {
        return null;
    }

    return verifyToken(token) as IUserData;
}