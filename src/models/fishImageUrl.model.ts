import { DataTypes, Model } from "sequelize"

import SQLModel from "~/constants/SQLModel"
import UUIDModel from "~/constants/UUIDModel"
import sequelize from "~/databases/database"

import { KoiFish } from "./koiFish.model"

const tableName = "FishImageUrl"

export const FishImageUrl = sequelize.define<FishImageUrlInstance>(tableName, {
  ...UUIDModel,
  koiFishId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ...SQLModel
})

FishImageUrl.belongsTo(KoiFish, {
  foreignKey: "koiFishId",
  as: "koiFish"
})

export interface FishImageUrlAttributes {
  id?: string
  koiFishId: string
  imageUrl: string
  isDeleted?: boolean
}

// Define FishImageUrlInstance interface
export interface FishImageUrlInstance extends Model<FishImageUrlAttributes>, FishImageUrlAttributes {}
