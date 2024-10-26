"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const element_service_1 = __importDefault(require("../services/element.service"));
async function getElements(req, res) {
    try {
        const pageIndex = parseInt(req.query.page_index) || 1;
        const pageSize = parseInt(req.query.page_size) || 10;
        const keyword = req.query.keyword;
        const { elements, pagination } = await element_service_1.default.getElements(pageIndex, pageSize, keyword);
        return res.json(responseStatus_1.default.responseData200("Get elements successfully!", elements, pagination));
    }
    catch (error) {
        return res.json(error);
    }
}
async function getElementById(req, res) {
    try {
        const id = req.params.id;
        if (!id) {
            return res.json(responseStatus_1.default.responseBadRequest400("Missing required fields"));
        }
        const dataResponse = await element_service_1.default.getElementById(id);
        return res.json(responseStatus_1.default.responseData200("Get element successfully!", dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
}
async function createElement(req, res) {
    try {
        const { name, imageUrl } = req.body;
        if (!name || !imageUrl) {
            return res.json(responseStatus_1.default.responseBadRequest400("Missing required fields"));
        }
        const dataRequest = {
            name,
            imageUrl
        };
        const dataResponse = await element_service_1.default.createElement(dataRequest);
        return res.json(responseStatus_1.default.responseCreateSuccess201("Create element successfully!", dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
}
async function updateElement(req, res) {
    try {
        const id = req.params.id;
        const { name, imageUrl } = req.body;
        if (!id) {
            return res.json(responseStatus_1.default.responseBadRequest400("Missing required fields"));
        }
        const dataRequest = {
            name,
            imageUrl
        };
        const dataResponse = await element_service_1.default.updateElement(id, dataRequest);
        return res.json(responseStatus_1.default.responseMessage200(dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
}
async function deleteElement(req, res) {
    try {
        const id = req.params.id;
        if (!id) {
            return res.json(responseStatus_1.default.responseBadRequest400("Missing required fields"));
        }
        const dataResponse = await element_service_1.default.deleteElement(id);
        return res.json(responseStatus_1.default.responseMessage200(dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
}
exports.default = {
    getElements,
    getElementById,
    createElement,
    updateElement,
    deleteElement
};
