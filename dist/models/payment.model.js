"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const sequelize_1 = require("sequelize");
const SQLModel_1 = __importDefault(require("../constants/SQLModel"));
const UUIDModel_1 = __importDefault(require("../constants/UUIDModel"));
const database_1 = __importDefault(require("../databases/database"));
const order_model_1 = require("./order.model");
const tableName = "Payment";
exports.Payment = database_1.default.define(tableName, {
    ...UUIDModel_1.default,
    orderId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    amount: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    payDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    payMethod: {
        type: sequelize_1.DataTypes.ENUM("CARD", "CASH"),
        allowNull: false
    },
    payStatus: {
        type: sequelize_1.DataTypes.ENUM("PENDING", "COMPLETED", "CANCEL"),
        allowNull: false,
        defaultValue: "PENDING"
    },
    ...SQLModel_1.default
});
exports.Payment.belongsTo(order_model_1.Order, {
    foreignKey: "orderId",
    as: "order"
});
