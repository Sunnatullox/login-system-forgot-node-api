"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInValidation = exports.signUpValidation = void 0;
const validator_1 = __importDefault(require("../utils/validator"));
const userSchema_1 = require("./userSchema");
const signUpValidation = (req, res, next) => (0, validator_1.default)(userSchema_1.userSchema.signUpUser, req.body, next);
exports.signUpValidation = signUpValidation;
const signInValidation = (req, res, next) => (0, validator_1.default)(userSchema_1.userSchema.signInUser, req.body, next);
exports.signInValidation = signInValidation;
