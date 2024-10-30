import { DataTypes, Model } from "sequelize"

import SQLModel from "~/constants/SQLModel"
import UUIDModel from "~/constants/UUIDModel"
import sequelize from "~/databases/database"

import { Supplier } from "./supplier.model"
import { Variety } from "./variety.model"

const tableName = "KoiFish"

export const KoiFish = sequelize.define<KoiFishInstance>(tableName, {
  ...UUIDModel,
  varietyId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM("MALE", "FEMALE"),
    allowNull: true
  },
  isSold: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  supplierId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  ...SQLModel
})

KoiFish.belongsTo(Variety, {
  foreignKey: "varietyId",
  as: "variety"
})

KoiFish.belongsTo(Supplier, {
  foreignKey: "supplierId",
  as: "supplier"
})

export interface KoiFishAttributes {
  id?: string
  varietyId: string
  name: string
  description: string | null
  size: number | null
  gender: "MALE" | "FEMALE" | null
  isSold: boolean
  supplierId: string
  price: number
  isDeleted?: boolean
}

// Define KoiFishInstance interface
export interface KoiFishInstance extends Model<KoiFishAttributes>, KoiFishAttributes {}
