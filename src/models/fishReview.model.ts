import { DataTypes, Model } from "sequelize"

import SQLModel from "~/constants/SQLModel"
import UUIDModel from "~/constants/UUIDModel"
import sequelize from "~/databases/database"

import { KoiFish } from "./koiFish.model"
import { User } from "./user.model"

const tableName = "FishReview"

export const FishReview = sequelize.define<FishReviewInstance>(tableName, {
  ...UUIDModel,
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  koiFishId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ...SQLModel
})

FishReview.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
})

FishReview.belongsTo(KoiFish, {
  foreignKey: "koiFishId",
  as: "koiFish"
})

export interface FishReviewAttributes {
  id?: string
  userId: string
  koiFishId: string
  content: string
  isDeleted?: boolean
}

// Define FishReviewInstance interface
export interface FishReviewInstance extends Model<FishReviewAttributes>, FishReviewAttributes {}
