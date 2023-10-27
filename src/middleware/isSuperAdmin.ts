import { NextFunction, Request, Response } from "express";

const isSuperAdmin = (req: any, res: Response, next: NextFunction) => {

  if (req.token.role !== "super_admin") {
    return res.json({
        succes: false,
        message:`Access Denied, you don't have sufficient permissions`
    })
  }

  next();
}

export { isSuperAdmin }