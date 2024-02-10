import { sign, verify } from 'jsonwebtoken';
import { GenericRequest } from '@fullstack-todo/types'
import { extractUserDataFromRequest } from '../validation/extractToken';
const secret = process.env["TOKEN_SECRET"] || "83c58082b741cce1101c6c0ea53d605f";

export const generateToken = (payload: IUserData) => sign(payload, secret, { expiresIn: '1d' });


export const verifyToken = (token: string | undefined) => {
    if (!token) return null      

    try {
      return verify(token, secret);
    }
    
    catch (error) {
      return false;
    }
};

export interface IUserData {
  id: number
  email: string
}

export const isUserAuthenticated = (request:GenericRequest) => {

  if (request && !request.headers) {
    return false;
  }

  const userData: IUserData = extractUserDataFromRequest(request) as IUserData;

  if (!userData.id || !userData.email) {   
    return false;
  }

  return userData;
}