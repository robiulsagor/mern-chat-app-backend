import { NextFunction, Request, Response } from "express";

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
        (req: Request, res: Response, next: NextFunction) => 
         Promise.resolve(fn(req, res, next)).catch(next)
        

// This function is a higher-order function that takes an async function as an argument and returns a new function.