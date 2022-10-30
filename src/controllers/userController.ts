import { Request, Response, NextFunction, RequestHandler } from "express";
import createHttpError, { InternalServerError } from "http-errors";
import User from "../model/UsersModels.js";
import { generateToken } from "../tokengenerate/utils/generateToken.js";
import { IExample } from "../model/UsersModels.js";
import nodemailer from "nodemailer";
import shortid from "shortid";
import SMTPTransport = require("nodemailer/lib/smtp-transport");
import Mail = require("nodemailer/lib/mailer");
import { transporter } from "../config/index.js";

export const signUpUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, fullName, countryCode, telNumber } =
      req.body;
    const existesUser = await User.findOne({ email });

    if (existesUser)
      return next(createHttpError(422, "Email or phone number Alread Exist!"));
    // regex for email
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    )
      return next(
        createHttpError(
          402,
          "Sorry, there is an error in your email, please enter the correct email"
        )
      );

    const user: IExample = await User.create({
      name,
      email,
      password,
      fullName,
      countryCode,
      telNumber,
    });

    if (user) {
      res.json({
        message: {
          _id: user._id,
          name: user.name,
          fullName: user.fullName,
          email: user.email,
          countryCode: user.countryCode,
          telNumber: user.telNumber,
          token: generateToken(user._id),
        },
      });
    } else {
      return next(createHttpError(400, "Invalid User Data"));
    }
  } catch (error) {
    return next(InternalServerError);
  }
};

export const signInUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user: any = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        message: {
          _id: user._id,
          name: user.name,
          fullName: user.fullName,
          email: user.email,
          countryCode: user.countryCode,
          telNumber: user.telNumber,
          createdAt: user.createdAt,
          token: generateToken(user._id),
        },
      });
    } else {
      return next(createHttpError(401, "Invalid email or passwod"));
    }
  } catch (error) {
    return next(InternalServerError);
  }
};

export const sendVerificationEmail: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email }: { email: string } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return next(createHttpError(404, "Email not Valid"));
    const userVerifyCode: string[] = [];

    let account = await nodemailer.createTestAccount();

    userVerifyCode.push(shortid.generate().toString());

    const mailOptions: Mail.Options = {
      from: "Your Verifed Platform", // sender address
      to: email, // list of receivers
      subject: `Your Verifed Code from Platform forgot password ✔`, // Subject line
      // text: , // plain text body
      html: ` Secret Code: <b>${userVerifyCode[0]}</b>`, // html body
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) next(createHttpError(402, err.message));
    });

    res.status(200).json({ message: userVerifyCode[0] });
  } catch (error) {
    return next(InternalServerError);
  }
};

export const sendForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, password } = req.body;

  try {
    const user: any = await User.findOne({ _id: userId });

    if (password) {
      user.password = password;
      const forgotPass = await user.save();

      res.json({
        message: {
          _id: forgotPass._id,
          name: forgotPass.name,
          fullName: forgotPass.fullName,
          email: forgotPass.email,
          countryCode: forgotPass.countryCode,
          telNumber: forgotPass.telNumber,
          token: generateToken(forgotPass._id),
        },
      });
    } else {
      return next(createHttpError(404, "User not found"));
    }
  } catch (error) {
    return next(InternalServerError);
  }
};
