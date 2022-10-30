"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendForgotPassword = exports.sendVerificationEmail = exports.signInUser = exports.signUpUser = void 0;
const http_errors_1 = __importStar(require("http-errors"));
const UsersModels_js_1 = __importDefault(require("../model/UsersModels.js"));
const generateToken_js_1 = require("../tokengenerate/utils/generateToken.js");
const nodemailer_1 = __importDefault(require("nodemailer"));
const shortid_1 = __importDefault(require("shortid"));
const index_js_1 = require("../config/index.js");
const signUpUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, fullName, countryCode, telNumber } = req.body;
        const existesUser = yield UsersModels_js_1.default.findOne({ email });
        if (existesUser)
            return next((0, http_errors_1.default)(422, "Email or phone number Alread Exist!"));
        // regex for email
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
            return next((0, http_errors_1.default)(402, "Sorry, there is an error in your email, please enter the correct email"));
        const user = yield UsersModels_js_1.default.create({
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
                    token: (0, generateToken_js_1.generateToken)(user._id),
                },
            });
        }
        else {
            return next((0, http_errors_1.default)(400, "Invalid User Data"));
        }
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.signUpUser = signUpUser;
const signInUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield UsersModels_js_1.default.findOne({ email });
        if (user && (yield user.matchPassword(password))) {
            res.json({
                message: {
                    _id: user._id,
                    name: user.name,
                    fullName: user.fullName,
                    email: user.email,
                    countryCode: user.countryCode,
                    telNumber: user.telNumber,
                    createdAt: user.createdAt,
                    token: (0, generateToken_js_1.generateToken)(user._id),
                },
            });
        }
        else {
            return next((0, http_errors_1.default)(401, "Invalid email or passwod"));
        }
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.signInUser = signInUser;
const sendVerificationEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield UsersModels_js_1.default.findOne({ email });
        if (!user)
            return next((0, http_errors_1.default)(404, "Email not Valid"));
        const userVerifyCode = [];
        let account = yield nodemailer_1.default.createTestAccount();
        userVerifyCode.push(shortid_1.default.generate().toString());
        const mailOptions = {
            from: "Your Verifed Platform",
            to: email,
            subject: `Your Verifed Code from Platform forgot password ✔`,
            // text: , // plain text body
            html: ` Secret Code: <b>${userVerifyCode[0]}</b>`, // html body
        };
        index_js_1.transporter.sendMail(mailOptions, (err) => {
            if (err)
                next((0, http_errors_1.default)(402, err.message));
        });
        res.status(200).json({ message: userVerifyCode[0] });
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.sendVerificationEmail = sendVerificationEmail;
const sendForgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, password } = req.body;
    try {
        const user = yield UsersModels_js_1.default.findOne({ _id: userId });
        if (password) {
            user.password = password;
            const forgotPass = yield user.save();
            res.json({
                message: {
                    _id: forgotPass._id,
                    name: forgotPass.name,
                    fullName: forgotPass.fullName,
                    email: forgotPass.email,
                    countryCode: forgotPass.countryCode,
                    telNumber: forgotPass.telNumber,
                    token: (0, generateToken_js_1.generateToken)(forgotPass._id),
                },
            });
        }
        else {
            return next((0, http_errors_1.default)(404, "User not found"));
        }
    }
    catch (error) {
        return next(http_errors_1.InternalServerError);
    }
});
exports.sendForgotPassword = sendForgotPassword;
