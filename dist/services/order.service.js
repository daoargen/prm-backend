"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseStatus_1 = __importDefault(require("../constants/responseStatus"));
const order_model_1 = require("../models/order.model");
const calculatePagination_utilt_1 = require("../utils/calculatePagination.utilt");
const formatTimeModel_util_1 = require("../utils/formatTimeModel.util");
const logNonCustomError_util_1 = require("../utils/logNonCustomError.util");
async function getOrders(pageIndex, pageSize, keyword) {
    try {
        const whereCondition = { isDeleted: false };
        if (keyword) {
            // Add conditions for keyword search if needed
        }
        const { count, rows: orders } = await order_model_1.Order.findAndCountAll({
            where: whereCondition,
            limit: pageSize,
            offset: (pageIndex - 1) * pageSize,
            order: [["createdAt", "DESC"]]
        });
        const dataResponse = orders.map((order) => (0, formatTimeModel_util_1.formatModelDate)(order.toJSON()));
        const pagination = (0, calculatePagination_utilt_1.calculatePagination)(count, pageSize, pageIndex);
        return { orders: dataResponse, pagination };
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function getOrderById(id) {
    try {
        const order = await order_model_1.Order.findOne({ where: { id, isDeleted: false } });
        if (!order) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy đơn hàng");
        }
        return order;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function createOrder(newOrder) {
    try {
        const createdOrder = await order_model_1.Order.create({
            userId: newOrder.userId,
            packageId: newOrder.packageId,
            postId: newOrder.postId,
            status: newOrder.status,
            totalAmount: newOrder.totalAmount
        });
        return createdOrder;
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function updateOrder(id, updatedOrder) {
    try {
        const order = await order_model_1.Order.findOne({ where: { id, isDeleted: false } });
        if (!order) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy đơn hàng");
        }
        order.userId = updatedOrder.userId || order.userId;
        order.packageId = updatedOrder.packageId || order.packageId;
        order.postId = updatedOrder.postId || order.postId;
        order.status = updatedOrder.status || order.status;
        order.totalAmount = updatedOrder.totalAmount || order.totalAmount;
        await order.save();
        return "Cập nhật đơn hàng thành công";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
async function deleteOrder(id) {
    try {
        const order = await order_model_1.Order.findOne({ where: { id, isDeleted: false } });
        if (!order) {
            throw responseStatus_1.default.responseNotFound404("Không tìm thấy đơn hàng");
        }
        order.isDeleted = true;
        await order.save();
        return "Xóa đơn hàng thành công";
    }
    catch (error) {
        (0, logNonCustomError_util_1.logNonCustomError)(error);
        throw error;
    }
}
exports.default = {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};
