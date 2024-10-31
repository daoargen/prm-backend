import { DataTypes, Model } from "sequelize"

import SQLModel from "~/constants/SQLModel"
import UUIDModel from "~/constants/UUIDModel"
import sequelize from "~/databases/database"

import { Product } from "./product.model"
import { User } from "./user.model"

const tableName = "ProductReview"

export const ProductReview = sequelize.define<ProductReviewInstance>(tableName, {
  ...UUIDModel,
  phoneNumber: {
    type: DataTypes.UUID,
    allowNull: false
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ...SQLModel
})

ProductReview.belongsTo(Product, {
  foreignKey: "productId",
  as: "product"
})

export interface ProductReviewAttributes {
  id?: string
  phoneNumber: string
  productId: string
  rating: number
  content: string
  isDeleted?: boolean
}

// Define ProductReviewInstance interface
export interface ProductReviewInstance extends Model<ProductReviewAttributes>, ProductReviewAttributes {}
