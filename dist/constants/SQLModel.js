"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const SQLModel = {
    isDeleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: (0, sequelize_1.literal)("NOW()")
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: (0, sequelize_1.literal)("NOW()")
    }
};
exports.default = SQLModel;
