import { DataTypes, Model } from "sequelize"

import SQLModel from "~/constants/SQLModel"
import UUIDModel from "~/constants/UUIDModel"
import sequelize from "~/databases/database"

import { Category } from "./category.model"
import { Product } from "./product.model"

const tableName = "ProductCategory"

export const ProductCategory = sequelize.define<ProductCategoryInstance>(tableName, {
  ...UUIDModel,
  productId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  ...SQLModel
})

ProductCategory.belongsTo(Product, {
  foreignKey: "productId",
  as: "product"
})

ProductCategory.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category"
})

export interface ProductCategoryAttributes {
  id?: string
  productId: string
  categoryId: string
  isDeleted?: boolean
}

// Define ProductCategoryInstance interface
export interface ProductCategoryInstance extends Model<ProductCategoryAttributes>, ProductCategoryAttributes {}
