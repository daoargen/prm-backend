import { DataTypes, Model } from "sequelize"

import SQLModel from "~/constants/SQLModel"
import UUIDModel from "~/constants/UUIDModel"
import sequelize from "~/databases/database"

const tableName = "Variety"

export const Variety = sequelize.define<VarietyInstance>(tableName, {
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

export interface VarietyAttributes {
  id?: string
  name: string
  description: string | null
  isDeleted?: boolean
}

// Define VarietyInstance interface
export interface VarietyInstance extends Model<VarietyAttributes>, VarietyAttributes {}
