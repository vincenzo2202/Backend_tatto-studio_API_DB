import { NextFunction, Request, Response } from "express";

const isAdmin = (req: any, res: Response, next: NextFunction) => {

  if (req.token.role !== ("admin")) {
    return res.json({
        succes: false,
        message:`Access Denied, you don't have sufficient permissions`
    })
  }

  next();
}

export { isAdmin }