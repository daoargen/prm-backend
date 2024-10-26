"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const user_model_1 = require("../models/user.model");
const userDetail_model_1 = require("../models/userDetail.model");
const formatTimeModel_util_1 = require("../utils/formatTimeModel.util");
async function getAllUsers(req) {
    try {
        // Xử lý tham số query và gán giá trị mặc định nếu không có
        const pageIndex = parseInt(req.query.page_index) || 1;
        const pageSize = parseInt(req.query.page_size) || 10;
        const keyword = req.query.keyword;
        const whereCondition = {
            isDeleted: false
        }; // Điều kiện tìm kiếm
        if (keyword) {
            whereCondition[sequelize_1.Op.or] = [
                { email: { [sequelize_1.Op.like]: `%${keyword}%` } }
                // Có thể thêm các điều kiện tìm kiếm khác nếu cần
            ];
        }
        // Tìm và đếm tổng số người dùng
        const { count, rows: users } = await user_model_1.User.findAndCountAll({
            where: whereCondition,
            limit: pageSize,
            offset: (pageIndex - 1) * pageSize,
            order: [["createdAt", "DESC"]]
        });
        // Định dạng lại dữ liệu người dùng
        const formattedUsers = users.map((user) => (0, formatTimeModel_util_1.formatModelDate)(user.dataValues));
        // Tính toán thông tin phân trang
        const totalPage = Math.ceil(count / pageSize);
        const pagination = {
            pageSize,
            totalItem: count,
            currentPage: pageIndex,
            maxPageSize: 100,
            totalPage
        };
        // Trả về kết quả
        return { users: formattedUsers, pagination };
    }
    catch (error) {
        console.error(error);
        throw error;
    }
} // Get all users
async function getUserById(userId) {
    try {
        const userDetail = await userDetail_model_1.UserDetail.findOne({
            where: { userId },
            include: [
                {
                    model: user_model_1.User,
                    as: "user",
                    attributes: ["email", "username", "role"]
                }
            ],
            attributes: { exclude: ["isDeleted", "createdAt", "updatedAt"] }
        });
        if (!userDetail)
            throw responseStatus_1.default.responseNotFound404("User not found");
        return userDetail;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
} // Find user by id
async function editUser(id, newUser) {
    try {
        // Kiểm tra xem UserDetail có tồn tại không
        const userDetail = await userDetail_model_1.UserDetail.findOne({
            where: { userId: id, isDeleted: false }
        });
        if (!userDetail) {
            throw responseStatus_1.default.responseNotFound404("User detail not found");
        }
        // Cập nhật các trường được cung cấp trong newUser
        await userDetail.update({
            phone: newUser.phone || userDetail.phone,
            firstName: newUser.firstName || userDetail.firstName,
            lastName: newUser.lastName || userDetail.lastName,
            dob: newUser.dob || userDetail.dob,
            gender: newUser.gender || userDetail.gender,
            avatarUrl: newUser.avatarUrl || userDetail.avatarUrl
        });
        return userDetail;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
} // Update user
async function deleteUser(id) {
    try {
        const user = await user_model_1.User.findOne({ where: { id, isDeleted: false } });
        if (!user) {
            throw responseStatus_1.default.responseNotFound404("User not found or already deleted");
        }
        const userDetail = await userDetail_model_1.UserDetail.findOne({ where: { userId: id, isDeleted: false } });
        if (!userDetail) {
            throw responseStatus_1.default.responseNotFound404("User detail not found or already deleted");
        }
        const userResult = await user_model_1.User.update({ isDeleted: true }, { where: { id } });
        const userDetailResult = await userDetail_model_1.UserDetail.update({ isDeleted: true }, { where: { userId: id } });
        if (userResult[0] === 0) {
            throw responseStatus_1.default.responeCustom(400, "Delete user failed");
        }
        if (userDetailResult[0] === 0) {
            throw responseStatus_1.default.responeCustom(400, "Delete user detail failed");
        }
        return;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
} // Delete user
async function uploadAvatarUser(user) {
    try {
        const result = await userDetail_model_1.UserDetail.update({
            avatarUrl: user.avatarUrl
        }, {
            where: { userId: user.userId }
        });
        return result;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
} // Update avatar user
exports.default = {
    getAllUsers,
    getUserById,
    editUser,
    deleteUser,
    uploadAvatarUser
};
