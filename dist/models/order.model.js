"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const sequelize_1 = require("sequelize");
const SQLModel_1 = __importDefault(require("../constants/SQLModel"));
const UUIDModel_1 = __importDefault(require("../constants/UUIDModel"));
const database_1 = __importDefault(require("../databases/database"));
const user_model_1 = require("./user.model");
const tableName = "Order";
exports.Order = database_1.default.define(tableName, {
    ...UUIDModel_1.default,
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    packageId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true
    },
    postId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("PENDING_CONFIRMATION", "COMPLETED", "CANCEL"),
        allowNull: false,
        defaultValue: "PENDING_CONFIRMATION"
    },
    totalAmount: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    ...SQLModel_1.default
});
exports.Order.belongsTo(user_model_1.User, {
    foreignKey: "userId",
    as: "user"
});
