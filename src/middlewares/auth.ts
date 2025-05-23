import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies.accessToken
    if (!token) {
         res.status(401).json({ status: false, message: 'No token provided' })
         return
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) 
        if(typeof decoded === 'object' && 'userId' in decoded) {
            req.userId = decoded.userId   
            next()
        }
    }
    catch {
         res.status(401).json({ message: 'Invalid Token' })
    }
}