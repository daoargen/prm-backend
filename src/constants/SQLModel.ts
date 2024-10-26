import { DataTypes, literal } from "sequelize"

const SQLModel = {
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: literal("NOW()")
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: literal("NOW()")
  }
}

export default SQLModel
