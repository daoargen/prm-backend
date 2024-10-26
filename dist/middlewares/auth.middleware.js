"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const type_1 = require("../constants/type");
function verifyMinimumRole(minimumRole) {
    return (req, res, next) => {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.json(responseStatus_1.default.responseUnauthorized401());
        }
        try {
            jsonwebtoken_1.default.verify(token, process.env.SECRET, (err, decoded) => {
                if (err) {
                    return res.json(responseStatus_1.default.responseBadRequest400("Invalid token"));
                }
                const decodedPayload = decoded;
                const userRole = type_1.Role[decodedPayload.role];
                if (userRole === undefined || userRole < minimumRole) {
                    return res.json(responseStatus_1.default.responseForbidden403());
                }
                next();
            });
        }
        catch (error) {
            console.log(error);
            return res.json(error);
        }
    };
}
function verifyToken(req, res, next) {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (token) {
            jsonwebtoken_1.default.verify(token, process.env.SECRET, (err, decoded) => {
                if (err) {
                    return res.json(responseStatus_1.default.responseBadRequest400("Invalid token"));
                }
                next();
            });
        }
        else {
            return res.json(responseStatus_1.default.responseUnauthorized401());
        }
    }
    catch (error) {
        console.log(error);
        return res.json(error);
    }
}
function verifyOnlyRole(onlyRole) {
    return (req, res, next) => {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.json(responseStatus_1.default.responseUnauthorized401());
        }
        try {
            jsonwebtoken_1.default.verify(token, process.env.SECRET, (err, decoded) => {
                if (err) {
                    return res.json(responseStatus_1.default.responseBadRequest400("Invalid token"));
                }
                const decodedPayload = decoded;
                const userRole = type_1.Role[decodedPayload.role];
                if (userRole === undefined || userRole === onlyRole) {
                    return res.json(responseStatus_1.default.responseForbidden403());
                }
                next();
            });
        }
        catch (error) {
            console.log(error);
            return res.json(error);
        }
    };
}
exports.default = {
    verifyMinimumRole,
    verifyToken,
    verifyOnlyRole
};
