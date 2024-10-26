"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const element_model_1 = require("../models/element.model");
const calculatePagination_utilt_1 = require("../utils/calculatePagination.utilt");
const formatTimeModel_util_1 = require("../utils/formatTimeModel.util");
const logNonCustomError_util_1 = require("../utils/logNonCustomError.util");
async function getElements(pageIndex, pageSize, keyword) {
    try {
        const whereCondition = { isDeleted: false };
        if (keyword) {
            whereCondition.name = { [sequelize_1.Op.like]: `%${keyword}%` };
        }
        const { count, rows: elements } = await element_model_1.Element.findAndCountAll({
            where: whereCondition,
            limit: pageSize,
            offset: (pageIndex - 1) * pageSize,
            order: [["createdAt", "DESC"]]
        });
        const dataResponse = elements.map((element) => (0, formatTimeModel_util_1.formatModelDate)(element.toJSON()));
        const pagination = (0, calculatePagination_utilt_1.calculatePagination)(count, pageSize, pageIndex);
        return { elements: dataResponse, pagination };
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function getElementById(id) {
    try {
        const element = await element_model_1.Element.findOne({ where: { id, isDeleted: false } });
        if (!element) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy nguyên tố");
        }
        return element;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function createElement(newElement) {
    try {
        const createdElement = await element_model_1.Element.create({
            name: newElement.name,
            imageUrl: newElement.imageUrl
        });
        return createdElement;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function updateElement(id, updatedElement) {
    try {
        const element = await element_model_1.Element.findOne({ where: { id, isDeleted: false } });
        if (!element) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy nguyên tố");
        }
        element.name = updatedElement.name || element.name;
        element.imageUrl = updatedElement.imageUrl || element.imageUrl;
        await element.save();
        return "Cập nhật nguyên tố thành công";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function deleteElement(id) {
    try {
        const element = await element_model_1.Element.findOne({ where: { id, isDeleted: false } });
        if (!element) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy nguyên tố");
        }
        element.isDeleted = true;
        await element.save();
        return "Xóa nguyên tố thành công";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
exports.default = {
    getElements,
    getElementById,
    createElement,
    updateElement,
    deleteElement
};
