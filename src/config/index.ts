import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export const DB = process.env.DB!;
export const PORT = parseInt(process.env.PORT!);
export const JWT_SECRET = parseInt( process.env.JWT_SECRET!);


export const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
        user: process.env.GMAILL!, // generated ethereal user
        pass: process.env.PASSWORD!, // generated ethereal password
    },
});
