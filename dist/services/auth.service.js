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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const sequelize_1 = require("sequelize");
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const user_model_1 = require("../models/user.model");
const userDetail_model_1 = require("../models/userDetail.model");
const bcrypt_util_1 = require("../utils/bcrypt.util");
const crypto_util_1 = require("../utils/crypto.util");
const getUserFromToken_util_1 = require("../utils/getUserFromToken.util");
const logNonCustomError_util_1 = require("../utils/logNonCustomError.util");
const sendEmail_util_1 = require("../utils/sendEmail.util");
const expiresIn = "1h";
const refreshTokens = [];
async function register(dataRequest) {
    try {
        if (!isValidUsername(dataRequest.username)) {
            throw responseStatus_1.default.responseBadRequest400("Invalid username: Only allow letters, numbers, and underscores");
        } // Kiểm tra regex tên người dùng
        if (!isValidPassword(dataRequest.password)) {
            throw responseStatus_1.default.responseBadRequest400("Invalid password: Must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character");
        } // Kiểm tra regex mật khẩu
        const existingUser = await user_model_1.User.findOne({
            where: {
                [sequelize_1.Op.or]: [{ username: dataRequest.username }, { email: dataRequest.email }]
            }
        }); // Kiểm tra tên người dùng hoặc email đã tồn tại chưa
        if (existingUser) {
            throw responseStatus_1.default.responseConflict409("Username or email already exists");
        }
        const hashedPassword = await (0, bcrypt_util_1.hashPassword)(dataRequest.password); // Mã hóa mật khẩu
        const data = {
            email: dataRequest.email,
            username: dataRequest.username,
            password: hashedPassword,
            role: dataRequest.role,
            dob: dataRequest.dob,
            gender: dataRequest.gender,
            iat: Date.now() // Thêm trường iat để xác định thời gian tạo
        };
        const encryptedData = (0, crypto_util_1.encrypt)(data); // Mã hóa dữ liệu
        const confirmLink = `${process.env.SERVER_URL}/api/auth/confirm-register?code=${encryptedData}`; // Tạo liên kết xác nhận tài khoản
        const emailHeader = "Confirm register account at Koine";
        const emailBody = `
      <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 2px solid #007bff; border-radius: 8px; background-color: #fff; font-family: 'Arial', sans-serif;">
          <h2 style="color: #007bff;">Koine - Nền tảng giáo dục giới tính cho trẻ em</h2>
          <p style="margin-bottom: 20px;">Click this link to register your account at Koine:</p>
      <a href="${confirmLink}" style="display: inline-block; padding: 10px 20px; text-decoration: none; background-color: #007bff; color: #fff; border-radius: 5px;" target="_blank">Link active your account</a>
      </div>
      `;
        await (0, sendEmail_util_1.sendEmail)(data.email, emailHeader, emailBody);
        return "Please check your email to confirm registration";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
} // Register new account
async function confirmRegister(code) {
    try {
        const data = (0, crypto_util_1.decrypt)(code); // Giải mã dữ liệu
        if (Date.now() - data.iat > 5 * 60 * 1000) {
            // 5 phút
            return responseStatus_1.default.responseUnauthorized401("Link has expired");
        } // Kiểm tra thời gian hết hạn
        const user = await user_model_1.User.create({
            email: data.email,
            username: data.username,
            password: data.password,
            role: data.role
        });
        if (!user.id) {
            throw responseStatus_1.default.responseInternalError500("Failed to create user");
        }
        // Tạo chi tiết người dùng
        await userDetail_model_1.UserDetail.create({
            userId: user.id,
            phone: null,
            firstName: "",
            lastName: "",
            dob: data.dob,
            gender: data.gender,
            avatarUrl: `https://avatar.iran.liara.run/public/boy?username=${user.username}`
        });
        return;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
} // Confirm register adult account
async function login(loginKey, password, res) {
    try {
        const searchCondition = loginKey.includes("@")
            ? { email: loginKey } // Nếu có '@', tìm theo email
            : { username: loginKey };
        const user = await user_model_1.User.findOne({
            where: searchCondition
        });
        if (!user) {
            throw responseStatus_1.default.responseNotFound404("User not found");
        }
        // So sánh mật khẩu đã nhập với mật khẩu đã hash trong cơ sở dữ liệu
        const isPasswordValid = await (0, bcrypt_util_1.comparePassword)(password, user.password);
        if (!isPasswordValid) {
            throw responseStatus_1.default.responseUnauthorized401("Authentication failed. Please check your credentials and try again.");
        }
        if (user && isPasswordValid) {
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            refreshTokens.push(refreshToken);
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict"
            });
            const jwtResponse = {
                accessToken: accessToken,
                refreshToken: refreshToken,
                expiresAt: new Date(new Date().setHours(new Date().getHours() + parseInt(expiresIn.substring(0, 1)))),
                account: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    role: user.role
                }
            };
            return jwtResponse;
        }
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
} // Login user
async function logout(refreshToken, res) {
    res.clearCookie("refreshToken");
    refreshTokens.filter((token) => token !== refreshToken);
    return;
} // Logout user
async function forgotPassword(email) {
    try {
        const user = await user_model_1.User.findOne({
            where: { email }
        });
        if (!user) {
            throw responseStatus_1.default.responseNotFound404("User not found");
        }
        const randomString = Math.random().toString(36).substring(2, 12);
        const hashedPassword = await bcrypt_1.default.hash(randomString, 10);
        const expiry = new Date(Date.now() + 15 * 60 * 1000); // Token hết hạn sau 15 phút
        const data = {
            id: user.id,
            expiry: expiry
        };
        const token = (0, crypto_util_1.encrypt)(data);
        user.password = hashedPassword;
        await user.save();
        const resetLink = `${process.env.SERVER_URL}/api/auth/reset-password?code=${token}`;
        const emailHeader = "Reset Your Password at Koine";
        const emailBody = `
      <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 2px solid #007bff; border-radius: 8px; background-color: #fff; font-family: 'Arial', sans-serif;">
          <h2 style="color: #007bff;">Koine - Nền tảng giáo dục giới tính cho trẻ em</h2>
          <p style="margin-bottom: 20px;">Your password has been reset. Your new password is: <strong>${randomString}</strong></p>
          <p style="margin-bottom: 20px;">We received a request to reset your password. Click the link below to reset password:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; text-decoration: none; background-color: #007bff; color: #fff; border-radius: 5px;" target="_blank">Reset Your Password</a>
          <p style="margin-top: 20px;">If you did not request a password reset, please ignore this email.</p>
      </div>
      `;
        await (0, sendEmail_util_1.sendEmail)(email, emailHeader, emailBody);
        return;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
} // Forgot password
async function resetPassword(code, oldPassword, newPassword) {
    try {
        const data = (0, crypto_util_1.decrypt)(code);
        if (data.expiry < Date.now()) {
            // 15 phút
            throw responseStatus_1.default.responseUnauthorized401("Link has expired");
        } // Kiểm tra thời gian hết hạn
        const user = await user_model_1.User.findOne({
            where: { id: data.id }
        });
        if (!user) {
            throw responseStatus_1.default.responseNotFound404("User not found");
        }
        if (!(0, bcrypt_util_1.comparePassword)(oldPassword, user.password)) {
            throw responseStatus_1.default.responseUnauthorized401("Old password is incorrect");
        }
        const hashedPassword = await (0, bcrypt_util_1.hashPassword)(newPassword);
        user.password = hashedPassword;
        await user.save();
        return;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
} // Reset password
async function changePassword(token, currentPassword, newPassword, confirmPassword) {
    try {
        const user = await (0, getUserFromToken_util_1.getUserFromToken)(token);
        const isPasswordCorrect = await (0, bcrypt_util_1.comparePassword)(currentPassword, user.password);
        if (!isPasswordCorrect) {
            throw responseStatus_1.default.responseUnauthorized401("Current password is incorrect");
        } // Kiểm tra mật khẩu hiện tại
        if (newPassword !== confirmPassword) {
            throw responseStatus_1.default.responseBadRequest400("Passwords do not match");
        }
        if (!isValidPassword(newPassword)) {
            throw responseStatus_1.default.responseBadRequest400("Invalid password: Must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character");
        } // Kiểm tra regex mật khẩu mới
        user.password = await (0, bcrypt_util_1.hashPassword)(newPassword);
        await user.save();
        return "Change password successfully!";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
} // Change password user
async function getRefreshToken(refreshToken, res) {
    if (!refreshTokens.includes(refreshToken)) {
        throw responseStatus_1.default.responseUnauthorized401("Invalid token");
    }
    jsonwebtoken_1.default.verify(refreshToken, process.env.SECRET, (err, user) => {
        if (err) {
            throw responseStatus_1.default.responseUnauthorized401("Invalid token");
        }
        refreshTokens.filter((token) => token !== refreshToken);
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);
        refreshTokens.push(newRefreshToken);
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict"
        });
        const jwtResponse = {
            accessToken: newAccessToken,
            refreshToken: refreshToken,
            expiresAt: new Date(new Date().setHours(new Date().getHours() + parseInt(expiresIn.substring(0, 1)))),
            account: {
                id: "",
                email: "",
                username: "",
                role: user.role
            }
        };
        return jwtResponse;
    });
} // Get refresh token
const generateAccessToken = (user) => {
    return (0, jsonwebtoken_1.sign)({
        id: user.id,
        username: user.username,
        role: user.role
    }, process.env.SECRET, {
        expiresIn: expiresIn
    });
}; // Generate access token
const generateRefreshToken = (user) => {
    return (0, jsonwebtoken_1.sign)({
        id: user.id,
        username: user.username,
        role: user.role
    }, process.env.SECRET, {
        expiresIn: "30d"
    });
}; // Generate refresh token
function isValidUsername(username) {
    // Chỉ cho phép các ký tự chữ cái (a-z, A-Z), số (0-9), và dấu gạch dưới (_)
    const regex = /^[a-zA-Z0-9_]+$/;
    return regex.test(username);
} // Check valid username, contains only letters, numbers, and underscores
function isValidPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
} // Check valid password, contains at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character
exports.default = {
    register,
    confirmRegister,
    login,
    forgotPassword,
    resetPassword,
    changePassword,
    getRefreshToken,
    logout
};
