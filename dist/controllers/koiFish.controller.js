"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const koiFish_service_1 = __importDefault(require("../services/koiFish.service"));
async function getKoiFishes(req, res) {
    try {
        const pageIndex = parseInt(req.query.page_index) || 1;
        const pageSize = parseInt(req.query.page_size) || 10;
        const keyword = req.query.keyword;
        const { koiFishes, pagination } = await koiFish_service_1.default.getKoiFishes(pageIndex, pageSize, keyword);
        return res.json(responseStatus_1.default.responseData200("Get koi fishes successfully!", koiFishes, pagination));
    }
    catch (error) {
        return res.json(error);
    }
}
async function getKoiFishById(req, res) {
    try {
        const id = req.params.id;
        if (!id) {
            return res.json(responseStatus_1.default.responseBadRequest400("Missing required fields"));
        }
        const dataResponse = await koiFish_service_1.default.getKoiFishById(id);
        return res.json(responseStatus_1.default.responseData200("Get koi fish successfully!", dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
}
async function createKoiFish(req, res) {
    try {
        const { varietyId, name, description, gender, isSold, supplierId, price, size, elementIds, imageUrls } = req.body;
        if (!varietyId || !name || !price || !supplierId) {
            return res.json(responseStatus_1.default.responseBadRequest400("Missing required fields"));
        }
        const dataRequest = {
            varietyId,
            name,
            description,
            gender,
            isSold,
            supplierId,
            price,
            size,
            elementIds,
            imageUrls
        };
        const dataResponse = await koiFish_service_1.default.createKoiFish(dataRequest);
        return res.json(responseStatus_1.default.responseCreateSuccess201("Create koi fish successfully!", dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
}
async function updateKoiFish(req, res) {
    try {
        const id = req.params.id;
        const { varietyId, name, description, gender, isSold, supplierId, price, size } = req.body;
        if (!id) {
            return res.json(responseStatus_1.default.responseBadRequest400("Missing required fields"));
        }
        const dataRequest = {
            varietyId,
            name,
            description,
            gender,
            isSold,
            supplierId,
            price,
            size
        };
        const dataResponse = await koiFish_service_1.default.updateKoiFish(id, dataRequest);
        return res.json(responseStatus_1.default.responseMessage200(dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
}
async function deleteKoiFish(req, res) {
    try {
        const id = req.params.id;
        if (!id) {
            return res.json(responseStatus_1.default.responseBadRequest400("Missing required fields"));
        }
        const dataResponse = await koiFish_service_1.default.deleteKoiFish(id);
        return res.json(responseStatus_1.default.responseMessage200(dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
}
exports.default = {
    getKoiFishes,
    getKoiFishById,
    createKoiFish,
    updateKoiFish,
    deleteKoiFish
};
