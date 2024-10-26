"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const user_service_1 = __importDefault(require("../services/user.service"));
async function getUsers(req, res) {
    try {
        const { users, pagination } = await user_service_1.default.getAllUsers(req);
        return res.json(responseStatus_1.default.responseData200("Get users list successfully!", users, pagination));
    }
    catch (error) {
        return res.json(error);
    }
} // Controller for get all users
async function getUser(req, res) {
    try {
        const id = req.params.id;
        const user = await user_service_1.default.getUserById(id);
        return res.json(responseStatus_1.default.responseData200("Get user successfully!", user));
    }
    catch (error) {
        return res.json(error);
    }
} // Controller for get user by id
async function editUser(req, res) {
    try {
        const id = req.params.id;
        const newUser = req.body;
        await user_service_1.default.editUser(id, newUser);
        return res.json(responseStatus_1.default.responseMessage200("Edit user successfully!"));
    }
    catch (error) {
        return res.json(error);
    }
} // Controller for edit user
async function deleteUser(req, res) {
    try {
        const id = req.params.id;
        await user_service_1.default.deleteUser(id);
        return res.json(responseStatus_1.default.responseMessage200("Delete user successfully!"));
    }
    catch (error) {
        return res.json(error);
    }
} // Controller for delete user
exports.default = {
    getUsers,
    getUser,
    editUser,
    deleteUser
};
