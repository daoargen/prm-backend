"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDetail = void 0;
const sequelize_1 = require("sequelize");
const SQLModel_1 = __importDefault(require("../constants/SQLModel"));
const UUIDModel_1 = __importDefault(require("../constants/UUIDModel"));
const database_1 = __importDefault(require("../databases/database"));
const user_model_1 = require("./user.model");
const tableName = "UserDetail";
exports.UserDetail = database_1.default.define(tableName, {
    ...UUIDModel_1.default,
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        unique: true
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    dob: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true
    },
    gender: {
        type: sequelize_1.DataTypes.ENUM("MALE", "FEMALE", "OTHER"),
        allowNull: true
    },
    avatarUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    ...SQLModel_1.default
});
exports.UserDetail.belongsTo(user_model_1.User, {
    foreignKey: "userId",
    as: "user"
});
