import { Op } from "sequelize"

import responseStatus from "~/constants/responseStatus"
import { CreateSupplier, UpdateSupplier } from "~/constants/type"
import { Supplier, SupplierInstance } from "~/models/supplier.model"
import { calculatePagination } from "~/utils/calculatePagination.utilt"
import { formatModelDate } from "~/utils/formatTimeModel.util"
import { logNonCustomError } from "~/utils/logNonCustomError.util"

async function getSuppliers(pageIndex: number, pageSize: number, keyword: string) {
  try {
    const whereCondition: any = { isDeleted: false }

    if (keyword) {
      whereCondition[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } },
        { phoneNumber: { [Op.like]: `%${keyword}%` } },
        { email: { [Op.like]: `%${keyword}%` } }
      ]
    }

    const { count, rows: suppliers } = await Supplier.findAndCountAll({
      where: whereCondition,
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
      order: [["createdAt", "DESC"]]
    })

    const dataResponse = suppliers.map((supplier) => formatModelDate(supplier.toJSON()))
    const pagination = calculatePagination(count, pageSize, pageIndex)

    return { suppliers: dataResponse, pagination }
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function getSupplierById(id: string) {
  try {
    const supplier = await Supplier.findOne({ where: { id, isDeleted: false } })
    if (!supplier) {
      throw responseStatus.responseNotFound404("Không tìm thấy nhà cung cấp")
    }
    return supplier
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function createSupplier(newSupplier: CreateSupplier) {
  try {
    const createdSupplier = await Supplier.create({
      name: newSupplier.name,
      description: newSupplier.description,
      phoneNumber: newSupplier.phoneNumber,
      email: newSupplier.email
    })
    return createdSupplier
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function updateSupplier(id: string, updatedSupplier: UpdateSupplier) {
  try {
    const supplier = await Supplier.findOne({ where: { id, isDeleted: false } })
    if (!supplier) {
      throw responseStatus.responseNotFound404("Không tìm thấy nhà cung cấp")
    }

    supplier.name = updatedSupplier.name || supplier.name
    supplier.description = updatedSupplier.description || supplier.description
    supplier.phoneNumber = updatedSupplier.phoneNumber || supplier.phoneNumber
    supplier.email = updatedSupplier.email || supplier.email

    await supplier.save()
    return "Cập nhật nhà cung cấp thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function deleteSupplier(id: string) {
  try {
    const supplier = await Supplier.findOne({ where: { id, isDeleted: false } })
    if (!supplier) {
      throw responseStatus.responseNotFound404("Không tìm thấy nhà cung cấp")
    }

    supplier.isDeleted = true
    await supplier.save()

    return "Xóa nhà cung cấp thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

export default {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
}
