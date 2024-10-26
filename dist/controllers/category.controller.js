"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const category_service_1 = __importDefault(require("../services/category.service"));
async function getCategories(req, res) {
    try {
        const pageIndex = parseInt(req.query.page_index) || 1;
        const pageSize = parseInt(req.query.page_size) || 10;
        const keyword = req.query.keyword;
        const { categories, pagination } = await category_service_1.default.getCategories(pageIndex, pageSize, keyword);
        return res.json(responseStatus_1.default.responseData200("Get categories successfully!", categories, pagination));
    }
    catch (error) {
        return res.json(error);
    }
}
async function getCategoryById(req, res) {
    try {
        const id = req.params.id;
        if (!id) {
            return res.json(responseStatus_1.default.responseBadRequest400("Missing required fields"));
        }
        const dataResponse = await category_service_1.default.getCategoryById(id);
        return res.json(responseStatus_1.default.responseData200("Get category successfully!", dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
}
async function createCategory(req, res) {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.json(responseStatus_1.default.responseBadRequest400("Missing required fields"));
        }
        const dataRequest = {
            name,
            description
        };
        const dataResponse = await category_service_1.default.createCategory(dataRequest);
        return res.json(responseStatus_1.default.responseCreateSuccess201("Create category successfully!", dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
}
async function updateCategory(req, res) {
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
        const dataResponse = await category_service_1.default.updateCategory(id, dataRequest);
        return res.json(responseStatus_1.default.responseMessage200(dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
}
async function deleteCategory(req, res) {
    try {
        const id = req.params.id;
        if (!id) {
            return res.json(responseStatus_1.default.responseBadRequest400("Missing required fields"));
        }
        const dataResponse = await category_service_1.default.deleteCategory(id);
        return res.json(responseStatus_1.default.responseMessage200(dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
}
exports.default = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
