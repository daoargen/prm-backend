"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const element_model_1 = require("../models/element.model");
const fishImageUrl_model_1 = require("../models/fishImageUrl.model");
const koiFish_model_1 = require("../models/koiFish.model");
const koiFishElement_model_1 = require("../models/koiFishElement.model");
const variety_model_1 = require("../models/variety.model");
const calculatePagination_utilt_1 = require("../utils/calculatePagination.utilt");
const formatTimeModel_util_1 = require("../utils/formatTimeModel.util");
const logNonCustomError_util_1 = require("../utils/logNonCustomError.util");
const fishImageUrl_service_1 = __importDefault(require("./fishImageUrl.service"));
const koiFishElement_service_1 = __importDefault(require("./koiFishElement.service"));
async function getKoiFishes(pageIndex, pageSize, keyword) {
    try {
        const whereCondition = { isDeleted: false };
        if (keyword) {
            whereCondition[sequelize_1.Op.or] = [{ name: { [sequelize_1.Op.like]: `%${keyword}%` } }, { description: { [sequelize_1.Op.like]: `%${keyword}%` } }];
        }
        const { count, rows: koiFishes } = await koiFish_model_1.KoiFish.findAndCountAll({
            where: whereCondition,
            limit: pageSize,
            offset: (pageIndex - 1) * pageSize,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: variety_model_1.Variety,
                    as: "variety",
                    attributes: ["name", "description"]
                }
            ]
        });
        let dataResponse = [];
        if (koiFishes.length > 0) {
            const koiFishIds = koiFishes.map((koifish) => koifish.id).filter((id) => id !== undefined);
            const koiFishElements = await koiFishElement_model_1.KoiFishElement.findAll({
                where: { koiFishId: koiFishIds, isDeleted: false },
                attributes: ["koiFishId", "elementId"]
            });
            const elementIds = koiFishElements
                .map((koiFishElement) => koiFishElement.elementId)
                .filter((elementId) => elementId !== undefined);
            const elements = await element_model_1.Element.findAll({
                where: { id: elementIds, isDeleted: false },
                attributes: ["id", "name", "imageUrl"]
            });
            const imageUrls = await fishImageUrl_model_1.FishImageUrl.findAll({
                where: { koiFishId: koiFishIds, isDeleted: false },
                attributes: ["id", "koiFishId", "imageUrl"]
            });
            const formatKoiFishs = koiFishes.map((koiFish) => {
                // Lấy danh sách koiFishElement có koiFishId tương ứng
                const relatedKoiFishElements = koiFishElements.filter((kfe) => kfe.koiFishId === koiFish.id);
                // Lấy danh sách element tương ứng từ relatedKoiFishElements
                const relatedElements = relatedKoiFishElements.map((kfe) => {
                    return elements.find((element) => element.id === kfe.elementId);
                });
                const relatedImageUrls = imageUrls.filter((kfi) => kfi.koiFishId === koiFish.id).map((kfi) => kfi.imageUrl);
                return {
                    ...koiFish.toJSON(),
                    elements: relatedElements,
                    imageUrls: relatedImageUrls
                };
            });
            dataResponse = formatKoiFishs.map((koiFish) => (0, formatTimeModel_util_1.formatModelDate)(koiFish));
        }
        // const dataResponse = koiFishes.map((koiFish) => formatModelDate(koiFish.toJSON()))
        const pagination = (0, calculatePagination_utilt_1.calculatePagination)(count, pageSize, pageIndex);
        return { koiFishes: dataResponse, pagination };
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function getKoiFishById(id) {
    try {
        const koiFish = await koiFish_model_1.KoiFish.findOne({ where: { id, isDeleted: false } });
        if (!koiFish) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy cá Koi");
        }
        return koiFish;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function createKoiFish(newKoiFish) {
    try {
        const createdKoiFish = await koiFish_model_1.KoiFish.create({
            varietyId: newKoiFish.varietyId,
            name: newKoiFish.name,
            description: newKoiFish.description,
            gender: newKoiFish.gender,
            isSold: newKoiFish.isSold,
            supplierId: newKoiFish.supplierId,
            price: newKoiFish.price,
            size: newKoiFish.size
        });
        if (!createdKoiFish.id) {
            throw responseStatus_1.default.responseBadRequest400("Tạo cá koi thất bại");
        }
        else {
            if (newKoiFish.elementIds) {
                newKoiFish.elementIds.map(async (elementId) => {
                    const newKoiFishElement = {
                        koiFishId: createdKoiFish.id,
                        elementId: elementId
                    };
                    await koiFishElement_service_1.default.createKoiFishElement(newKoiFishElement);
                });
            }
            if (newKoiFish.imageUrls) {
                newKoiFish.imageUrls.map(async (imageUrl) => {
                    const newKoiFishImageUrl = {
                        koiFishId: createdKoiFish.id,
                        imageUrl: imageUrl
                    };
                    await fishImageUrl_service_1.default.createFishImageUrl(newKoiFishImageUrl);
                });
            }
        }
        return createdKoiFish;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function updateKoiFish(id, updatedKoiFish) {
    try {
        const koiFish = await koiFish_model_1.KoiFish.findOne({ where: { id, isDeleted: false } });
        if (!koiFish) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy cá Koi");
        }
        koiFish.varietyId = updatedKoiFish.varietyId || koiFish.varietyId;
        koiFish.name = updatedKoiFish.name || koiFish.name;
        koiFish.description = updatedKoiFish.description || koiFish.description;
        koiFish.gender = updatedKoiFish.gender || koiFish.gender;
        koiFish.isSold = updatedKoiFish.isSold || koiFish.isSold;
        koiFish.supplierId = updatedKoiFish.supplierId || koiFish.supplierId;
        koiFish.price = updatedKoiFish.price || koiFish.price;
        koiFish.size = updatedKoiFish.size || koiFish.size;
        await koiFish.save();
        return "Cập nhật cá Koi thành công";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function deleteKoiFish(id) {
    try {
        const koiFish = await koiFish_model_1.KoiFish.findOne({ where: { id, isDeleted: false } });
        if (!koiFish) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy cá Koi");
        }
        koiFish.isDeleted = true;
        await koiFish.save();
        return "Xóa cá Koi thành công";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
exports.default = {
    getKoiFishes,
    getKoiFishById,
    createKoiFish,
    updateKoiFish,
    deleteKoiFish
};
