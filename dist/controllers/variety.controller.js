"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const variety_service_1 = __importDefault(require("../services/variety.service"));
async function getVarieties(req, res) {
    try {
        const pageIndex = parseInt(req.query.page_index) || 1;
        const pageSize = parseInt(req.query.page_size) || 10;
        const keyword = req.query.keyword;
        const { varieties, pagination } = await variety_service_1.default.getVarieties(pageIndex, pageSize, keyword);
        return res.json(responseStatus_1.default.responseData200("Get varieties successfully!", varieties, pagination));
    }
    catch (error) {
        return res.json(error);
    }
}
async function getVarietyById(req, res) {
    try {
        const id = req.params.id;
        if (!id) {
            return res.json(responseStatus_1.default.responseBadRequest400("Missing required fields"));
        }
        const dataResponse = await variety_service_1.default.getVarietyById(id);
        return res.json(responseStatus_1.default.responseData200("Get variety successfully!", dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
}
async function createVariety(req, res) {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.json(responseStatus_1.default.responseBadRequest400("Missing required fields"));
        }
        const dataRequest = {
            name,
            description
        };
        const dataResponse = await variety_service_1.default.createVariety(dataRequest);
        return res.json(responseStatus_1.default.responseCreateSuccess201("Create variety successfully!", dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
}
async function updateVariety(req, res) {
    try {
        const id = req.params.id;
        const { name, description } = req.body;
        if (!id) {
            return res.json(responseStatus_1.default.responseBadRequest400("Missing required fields"));
        }
        const dataRequest = {
            name,
            description
        };
        const dataResponse = await variety_service_1.default.updateVariety(id, dataRequest);
        return res.json(responseStatus_1.default.responseMessage200(dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
}
async function deleteVariety(req, res) {
    try {
        const id = req.params.id;
        if (!id) {
            return res.json(responseStatus_1.default.responseBadRequest400("Missing required fields"));
        }
        const dataResponse = await variety_service_1.default.deleteVariety(id);
        return res.json(responseStatus_1.default.responseMessage200(dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
}
exports.default = {
    getVarieties,
    getVarietyById,
    createVariety,
    updateVariety,
    deleteVariety
};
