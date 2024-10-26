import { DataTypes, Model } from "sequelize"

import SQLModel from "~/constants/SQLModel"
import UUIDModel from "~/constants/UUIDModel"
import sequelize from "~/databases/database"

import { Product } from "./product.model"

const tableName = "ProductImageUrl"

export const ProductImageUrl = sequelize.define<ProductImageUrlInstance>(tableName, {
  ...UUIDModel,
  productId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ...SQLModel
})

ProductImageUrl.belongsTo(Product, {
  foreignKey: "productId",
  as: "product"
})

export interface ProductImageUrlAttributes {
  id?: string
  productId: string
  imageUrl: string
  isDeleted?: boolean
}

// Define ProductImageUrlInstance interface
export interface ProductImageUrlInstance extends Model<ProductImageUrlAttributes>, ProductImageUrlAttributes {}
