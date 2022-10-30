"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = exports.JWT_SECRET = exports.PORT = exports.DB = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
dotenv_1.default.config();
exports.DB = process.env.DB;
exports.PORT = parseInt(process.env.PORT);
exports.JWT_SECRET = parseInt(process.env.JWT_SECRET);
exports.transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    secure: true,
    auth: {
        user: process.env.GMAILL,
        pass: process.env.PASSWORD, // generated ethereal password
    },
});
