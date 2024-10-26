"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KoiFishElement = void 0;
const sequelize_1 = require("sequelize");
const SQLModel_1 = __importDefault(require("../constants/SQLModel"));
const UUIDModel_1 = __importDefault(require("../constants/UUIDModel"));
const database_1 = __importDefault(require("../databases/database"));
const element_model_1 = require("./element.model");
const koiFish_model_1 = require("./koiFish.model");
const tableName = "KoiFishElement";
exports.KoiFishElement = database_1.default.define(tableName, {
    ...UUIDModel_1.default,
    koiFishId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    elementId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    ...SQLModel_1.default
});
exports.KoiFishElement.belongsTo(koiFish_model_1.KoiFish, {
    foreignKey: "koiFishId",
    as: "koiFish"
});
exports.KoiFishElement.belongsTo(element_model_1.Element, {
    foreignKey: "elementId",
    as: "element"
});
