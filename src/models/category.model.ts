import { DataTypes, Model } from "sequelize"

import SQLModel from "~/constants/SQLModel"
import UUIDModel from "~/constants/UUIDModel"
import sequelize from "~/databases/database"

const tableName = "Category"

export const Category = sequelize.define<CategoryInstance>(tableName, {
  ...UUIDModel,
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ...SQLModel
})

export interface CategoryAttributes {
  id?: string
  name: string
  description: string | null
  isDeleted?: boolean
}

// Define CategoryInstance interface
export interface CategoryInstance extends Model<CategoryAttributes>, CategoryAttributes {}
