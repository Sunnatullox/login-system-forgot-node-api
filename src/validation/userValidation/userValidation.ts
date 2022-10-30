import { RequestHandler } from "express";
import validator from "../utils/validator";
import { userSchema } from "./userSchema";

export const signUpValidation: RequestHandler = (req, res, next) =>
  validator(userSchema.signUpUser, req.body, next);

export const signInValidation: RequestHandler = (req, res, next) =>
  validator(userSchema.signInUser, req.body, next);
