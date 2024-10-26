"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const variety_model_1 = require("../models/variety.model");
const calculatePagination_utilt_1 = require("../utils/calculatePagination.utilt");
const formatTimeModel_util_1 = require("../utils/formatTimeModel.util");
const logNonCustomError_util_1 = require("../utils/logNonCustomError.util");
async function getVarieties(pageIndex, pageSize, keyword) {
    try {
        const whereCondition = { isDeleted: false };
        if (keyword) {
            whereCondition.name = { [sequelize_1.Op.like]: `%${keyword}%` };
        }
        const { count, rows: varieties } = await variety_model_1.Variety.findAndCountAll({
            where: whereCondition,
            limit: pageSize,
            offset: (pageIndex - 1) * pageSize,
            order: [["createdAt", "DESC"]]
        });
        const dataResponse = varieties.map((variety) => (0, formatTimeModel_util_1.formatModelDate)(variety.toJSON()));
        const pagination = (0, calculatePagination_utilt_1.calculatePagination)(count, pageSize, pageIndex);
        return { varieties: dataResponse, pagination };
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function getVarietyById(id) {
    try {
        const variety = await variety_model_1.Variety.findOne({ where: { id, isDeleted: false } });
        if (!variety) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy giống cá");
        }
        return variety;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function createVariety(newVariety) {
    try {
        const createdVariety = await variety_model_1.Variety.create({
            name: newVariety.name,
            description: newVariety.description
        });
        return createdVariety;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function updateVariety(id, updatedVariety) {
    try {
        const variety = await variety_model_1.Variety.findOne({ where: { id, isDeleted: false } });
        if (!variety) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy giống cá");
        }
        variety.name = updatedVariety.name || variety.name;
        variety.description = updatedVariety.description || variety.description;
        await variety.save();
        return "Cập nhật giống cá thành công";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function deleteVariety(id) {
    try {
        const variety = await variety_model_1.Variety.findOne({ where: { id: id, isDeleted: false } });
        if (!variety) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy giống cá");
        }
        variety.isDeleted = true;
        await variety.save();
        return "Xóa giống cá thành công";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
exports.default = {
    getVarieties,
    getVarietyById,
    createVariety,
    updateVariety,
    deleteVariety
};
