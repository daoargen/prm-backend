"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const fishImageUrl_model_1 = require("../models/fishImageUrl.model");
const calculatePagination_utilt_1 = require("../utils/calculatePagination.utilt");
const formatTimeModel_util_1 = require("../utils/formatTimeModel.util");
const logNonCustomError_util_1 = require("../utils/logNonCustomError.util");
async function getFishImageUrls(pageIndex, pageSize) {
    try {
        const whereCondition = { isDeleted: false };
        const { count, rows: fishImageUrls } = await fishImageUrl_model_1.FishImageUrl.findAndCountAll({
            where: whereCondition,
            limit: pageSize,
            offset: (pageIndex - 1) * pageSize,
            order: [["createdAt", "DESC"]]
        });
        const dataResponse = fishImageUrls.map((fishImageUrl) => (0, formatTimeModel_util_1.formatModelDate)(fishImageUrl.toJSON()));
        const pagination = (0, calculatePagination_utilt_1.calculatePagination)(count, pageSize, pageIndex);
        return { fishImageUrls: dataResponse, pagination };
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function getFishImageUrlById(id) {
    try {
        const fishImageUrl = await fishImageUrl_model_1.FishImageUrl.findOne({ where: { id, isDeleted: false } });
        if (!fishImageUrl) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy ảnh cá");
        }
        return fishImageUrl;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function createFishImageUrl(newFishImageUrl) {
    try {
        const createdFishImageUrl = await fishImageUrl_model_1.FishImageUrl.create({
            koiFishId: newFishImageUrl.koiFishId,
            imageUrl: newFishImageUrl.imageUrl
        });
        return createdFishImageUrl;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function updateFishImageUrl(id, updatedFishImageUrl) {
    try {
        const fishImageUrl = await fishImageUrl_model_1.FishImageUrl.findOne({ where: { id, isDeleted: false } });
        if (!fishImageUrl) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy ảnh cá");
        }
        fishImageUrl.koiFishId = updatedFishImageUrl.koiFishId || fishImageUrl.koiFishId;
        fishImageUrl.imageUrl = updatedFishImageUrl.imageUrl || fishImageUrl.imageUrl;
        await fishImageUrl.save();
        return "Cập nhật ảnh cá thành công";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function deleteFishImageUrl(id) {
    try {
        const fishImageUrl = await fishImageUrl_model_1.FishImageUrl.findOne({ where: { id, isDeleted: false } });
        if (!fishImageUrl) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy ảnh cá");
        }
        fishImageUrl.isDeleted = true;
        await fishImageUrl.save();
        return "Xóa ảnh cá thành công";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
exports.default = {
    getFishImageUrls,
    getFishImageUrlById,
    createFishImageUrl,
    updateFishImageUrl,
    deleteFishImageUrl
};
