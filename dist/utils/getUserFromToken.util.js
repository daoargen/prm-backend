"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFromToken = getUserFromToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const user_model_1 = require("../models/user.model");
async function getUserFromToken(token) {
    const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET);
    if (!decoded) {
        throw responseStatus_1.default.responseUnauthorized401("Invalid token");
    }
    const user = await user_model_1.User.findOne({ where: { id: decoded.id } });
    if (!user)
        throw responseStatus_1.default.responseNotFound404("User not found");
    return user;
}
