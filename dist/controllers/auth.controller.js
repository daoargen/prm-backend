"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const auth_service_1 = __importDefault(require("../services/auth.service"));
async function register(req, res) {
    try {
        const { email, username, password, gender, dob, role } = req.body;
        if (!email || !username || !password || !gender || !dob) {
            return res.json(responseStatus_1.default.responseNotFound404("Missing required fields"));
        }
        const userRole = role || "USER";
        const dataRequest = {
            email,
            username,
            password,
            gender,
            dob,
            role: userRole
        };
        const dataResponse = await auth_service_1.default.register(dataRequest);
        return res.json(responseStatus_1.default.responseMessage200(dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
} // Controller for registering new account
async function confirmRegister(req, res) {
    try {
        const code = req.query.code;
        if (!code) {
            return res.json(responseStatus_1.default.responseBadRequest400("Missing confirmation code"));
        }
        await auth_service_1.default.confirmRegister(code);
        return res.status(200).redirect(`${process.env.SERVER_URL}/api/auth/login`);
    }
    catch (error) {
        return res.json(error);
    }
} // Controller for confirming registration
async function login(req, res) {
    try {
        const { loginKey, password } = req.body;
        if (!loginKey || !password) {
            return res.json(responseStatus_1.default.responseNotFound404("Missing required fields"));
        }
        const dataResponse = await auth_service_1.default.login(loginKey, password, res);
        return res.json(responseStatus_1.default.responseData200("Login successfully!", dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
} // Controller for logging in
async function logout(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;
        await auth_service_1.default.logout(refreshToken, res);
        return res.json(responseStatus_1.default.responseMessage200("Logout successfully!"));
    }
    catch (error) {
        return res.json(error);
    }
} // Controller for logging out
async function forgotPassword(req, res) {
    try {
        const email = req.body.email;
        if (!email)
            return res.json(responseStatus_1.default.responseNotFound404("Missing email"));
        auth_service_1.default.forgotPassword(email);
        return res.json(responseStatus_1.default.responseMessage200("Please check your email to reset password!"));
    }
    catch (error) {
        return res.json(error);
    }
} // Controller for forgot password
async function resetPassword(req, res) {
    try {
        const code = req.query.code;
        const { oldPassword, newPassword } = req.body;
        auth_service_1.default.resetPassword(code, oldPassword, newPassword);
        return res.json(responseStatus_1.default.responseMessage200("Reset password successfully!"));
    }
    catch (error) {
        return res.json(error);
    }
} // Controller for resetting password
async function changePassword(req, res) {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.json(responseStatus_1.default.responseUnauthorized401());
        }
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.json(responseStatus_1.default.responseNotFound404("Missing required fields"));
        }
        const dataResponse = await auth_service_1.default.changePassword(token, currentPassword, newPassword, confirmPassword);
        return res.json(responseStatus_1.default.responseMessage200(dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
} // Controller for changing password
async function getRefreshToken(req, res) {
    try {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken)
            return res.json(responseStatus_1.default.responseUnauthorized401());
        const dataResponse = await auth_service_1.default.getRefreshToken(refreshToken, res);
        return res.json(responseStatus_1.default.responseData200("Get refresh token successfully!", dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
} // Controller for getting refresh token
exports.default = {
    register,
    confirmRegister,
    login,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    getRefreshToken
};
