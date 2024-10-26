"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const fishReview_service_1 = __importDefault(require("../services/fishReview.service"));
async function createFishReview(req, res) {
    try {
        const { userId, koiFishId, content } = req.body;
        if (!userId || !koiFishId || !content) {
            return res.json(responseStatus_1.default.responseBadRequest400("Missing required fields"));
        }
        const dataRequest = {
            userId,
            koiFishId,
            content
        };
        const dataResponse = await fishReview_service_1.default.createFishReview(dataRequest);
        return res.json(responseStatus_1.default.responseCreateSuccess201("Create fish review successfully!", dataResponse));
    }
    catch (error) {
        return res.json(error);
    }
}
exports.default = {
    createFishReview
};
