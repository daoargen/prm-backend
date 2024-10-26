"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FishImageUrl = void 0;
const sequelize_1 = require("sequelize");
const SQLModel_1 = __importDefault(require("../constants/SQLModel"));
const UUIDModel_1 = __importDefault(require("../constants/UUIDModel"));
const database_1 = __importDefault(require("../databases/database"));
const koiFish_model_1 = require("./koiFish.model");
const tableName = "FishImageUrl";
exports.FishImageUrl = database_1.default.define(tableName, {
    ...UUIDModel_1.default,
    koiFishId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    imageUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    ...SQLModel_1.default
});
exports.FishImageUrl.belongsTo(koiFish_model_1.KoiFish, {
    foreignKey: "koiFishId",
    as: "koiFish"
});
