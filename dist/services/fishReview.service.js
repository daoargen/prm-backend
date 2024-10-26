"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const fishReview_model_1 = require("../models/fishReview.model");
const calculatePagination_utilt_1 = require("../utils/calculatePagination.utilt");
const formatTimeModel_util_1 = require("../utils/formatTimeModel.util");
const logNonCustomError_util_1 = require("../utils/logNonCustomError.util");
async function getFishReviews(pageIndex, pageSize) {
    try {
        const whereCondition = { isDeleted: false };
        const { count, rows: fishReviews } = await fishReview_model_1.FishReview.findAndCountAll({
            where: whereCondition,
            limit: pageSize,
            offset: (pageIndex - 1) * pageSize,
            order: [["createdAt", "DESC"]]
        });
        const dataResponse = fishReviews.map((fishReview) => (0, formatTimeModel_util_1.formatModelDate)(fishReview.toJSON()));
        const pagination = (0, calculatePagination_utilt_1.calculatePagination)(count, pageSize, pageIndex);
        return { fishReviews: dataResponse, pagination };
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function getFishReviewById(id) {
    try {
        const fishReview = await fishReview_model_1.FishReview.findOne({ where: { id, isDeleted: false } });
        if (!fishReview) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy đánh giá cá");
        }
        return fishReview;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function createFishReview(newFishReview) {
    try {
        const createdFishReview = await fishReview_model_1.FishReview.create({
            userId: newFishReview.userId,
            koiFishId: newFishReview.koiFishId,
            content: newFishReview.content
        });
        return createdFishReview;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function updateFishReview(id, updatedFishReview) {
    try {
        const fishReview = await fishReview_model_1.FishReview.findOne({ where: { id, isDeleted: false } });
        if (!fishReview) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy đánh giá cá");
        }
        fishReview.userId = updatedFishReview.userId || fishReview.userId;
        fishReview.koiFishId = updatedFishReview.koiFishId || fishReview.koiFishId;
        fishReview.content = updatedFishReview.content || fishReview.content;
        await fishReview.save();
        return "Cập nhật đánh giá cá thành công";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function deleteFishReview(id) {
    try {
        const fishReview = await fishReview_model_1.FishReview.findOne({ where: { id, isDeleted: false } });
        if (!fishReview) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy đánh giá cá");
        }
        fishReview.isDeleted = true;
        await fishReview.save();
        return "Xóa đánh giá cá thành công";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
exports.default = {
    getFishReviews,
    getFishReviewById,
    createFishReview,
    updateFishReview,
    deleteFishReview
};
