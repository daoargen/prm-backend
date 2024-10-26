"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const customerSchema = zod_1.z.object({
    phone: zod_1.z
        .string()
        .regex(/^\d{10}$/, "Phone number must be numeric and have 10 characters")
        .startsWith("0")
        .optional(),
    firstName: zod_1.z.string().min(1, "First name must have at least one character").optional(),
    lastName: zod_1.z.string().min(1, "Last name must have at least one character").optional(),
    dob: zod_1.z.string().optional(),
    gender: zod_1.z.enum(["MALE", "FEMALE", "OTHER", "UNKNOWN"]).optional(),
    avatarUrl: zod_1.z.string().url("Avatar Url must be a valid Url").optional()
}); // Define the customer schema using Zod
function validateUser(req, res, next) {
    try {
        customerSchema.parse(req.body);
        next();
    }
    catch (error) {
        res.json(responseStatus_1.default.invalidFieldResquest("Invalid customer data provided", error));
    }
} // Generic validation function (refer to previous explanation)
exports.default = { validateUser };
