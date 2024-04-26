import { NextFunction, Request, Response } from "express";
module.exports.isUserAuthenticated = (req:Request, res:Response, next:NextFunction) => {
    if (req.user) {
      next();
    } else {
      res.status(401).send("You must login first!");
    }
  };