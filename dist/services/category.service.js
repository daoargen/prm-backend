"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const category_model_1 = require("../models/category.model");
const calculatePagination_utilt_1 = require("../utils/calculatePagination.utilt");
const formatTimeModel_util_1 = require("../utils/formatTimeModel.util");
const logNonCustomError_util_1 = require("../utils/logNonCustomError.util");
async function getCategories(pageIndex, pageSize, keyword) {
    try {
        const whereCondition = { isDeleted: false };
        if (keyword) {
            whereCondition.name = { [sequelize_1.Op.like]: `%${keyword}%` };
        }
        const { count, rows: categories } = await category_model_1.Category.findAndCountAll({
            where: whereCondition,
            limit: pageSize,
            offset: (pageIndex - 1) * pageSize,
            order: [["createdAt", "DESC"]]
        });
        const dataResponse = categories.map((category) => (0, formatTimeModel_util_1.formatModelDate)(category.toJSON()));
        const pagination = (0, calculatePagination_utilt_1.calculatePagination)(count, pageSize, pageIndex);
        return { categories: dataResponse, pagination };
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function getCategoryById(id) {
    try {
        const category = await category_model_1.Category.findOne({ where: { id, isDeleted: false } });
        if (!category) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy danh mục");
        }
        return category;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function createCategory(newCategory) {
    try {
        const createdCategory = await category_model_1.Category.create({
            name: newCategory.name,
            description: newCategory.description
        });
        return createdCategory;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function updateCategory(id, updatedCategory) {
    try {
        const category = await category_model_1.Category.findOne({ where: { id, isDeleted: false } });
        if (!category) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy danh mục");
        }
        category.name = updatedCategory.name || category.name;
        category.description = updatedCategory.description || category.description;
        await category.save();
        return "Cập nhật danh mục thành công";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function deleteCategory(id) {
    try {
        const category = await category_model_1.Category.findOne({ where: { id, isDeleted: false } });
        if (!category) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy danh mục");
        }
        category.isDeleted = true;
        await category.save();
        return "Xóa danh mục thành công";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
exports.default = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
