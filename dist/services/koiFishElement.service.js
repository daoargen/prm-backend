"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const koiFishElement_model_1 = require("../models/koiFishElement.model");
const calculatePagination_utilt_1 = require("../utils/calculatePagination.utilt");
const formatTimeModel_util_1 = require("../utils/formatTimeModel.util");
const logNonCustomError_util_1 = require("../utils/logNonCustomError.util");
async function getKoiFishElements(pageIndex, pageSize) {
    try {
        const { count, rows: koiFishElements } = await koiFishElement_model_1.KoiFishElement.findAndCountAll({
            where: { isDeleted: false },
            limit: pageSize,
            offset: (pageIndex - 1) * pageSize,
            order: [["createdAt", "DESC"]]
        });
        const dataResponse = koiFishElements.map((koiFishElement) => (0, formatTimeModel_util_1.formatModelDate)(koiFishElement.toJSON()));
        const pagination = (0, calculatePagination_utilt_1.calculatePagination)(count, pageSize, pageIndex);
        return { koiFishElements: dataResponse, pagination };
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function getKoiFishElementById(id) {
    try {
        const koiFishElement = await koiFishElement_model_1.KoiFishElement.findOne({ where: { id, isDeleted: false } });
        if (!koiFishElement) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy nguyên tố cá Koi");
        }
        return koiFishElement;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function createKoiFishElement(newKoiFishElement) {
    try {
        const createdKoiFishElement = await koiFishElement_model_1.KoiFishElement.create({
            koiFishId: newKoiFishElement.koiFishId,
            elementId: newKoiFishElement.elementId
        });
        return createdKoiFishElement;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function updateKoiFishElement(id, updatedKoiFishElement) {
    try {
        const koiFishElement = await koiFishElement_model_1.KoiFishElement.findOne({ where: { id, isDeleted: false } });
        if (!koiFishElement) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy nguyên tố cá Koi");
        }
        koiFishElement.koiFishId = updatedKoiFishElement.koiFishId || koiFishElement.koiFishId;
        koiFishElement.elementId = updatedKoiFishElement.elementId || koiFishElement.elementId;
        await koiFishElement.save();
        return "Cập nhật nguyên tố cá Koi thành công";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function deleteKoiFishElement(id) {
    try {
        const koiFishElement = await koiFishElement_model_1.KoiFishElement.findOne({ where: { id, isDeleted: false } });
        if (!koiFishElement) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy nguyên tố cá Koi");
        }
        koiFishElement.isDeleted = true;
        await koiFishElement.save();
        return "Xóa nguyên tố cá Koi thành công";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
exports.default = {
    getKoiFishElements,
    getKoiFishElementById,
    createKoiFishElement,
    updateKoiFishElement,
    deleteKoiFishElement
};
