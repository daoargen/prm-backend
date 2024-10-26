import { Op } from "sequelize"

import responseStatus from "~/constants/responseStatus"
import { CreateVariety, UpdateVariety } from "~/constants/type"
import { Variety } from "~/models/variety.model"
import { calculatePagination } from "~/utils/calculatePagination.utilt"
import { formatModelDate } from "~/utils/formatTimeModel.util"
import { logNonCustomError } from "~/utils/logNonCustomError.util"

async function getVarieties(pageIndex: number, pageSize: number, keyword: string) {
  try {
    const whereCondition: any = { isDeleted: false }

    if (keyword) {
      whereCondition.name = { [Op.like]: `%${keyword}%` }
    }

    const { count, rows: varieties } = await Variety.findAndCountAll({
      where: whereCondition,
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
      order: [["createdAt", "DESC"]]
    })

    const dataResponse = varieties.map((variety) => formatModelDate(variety.toJSON()))
    const pagination = calculatePagination(count, pageSize, pageIndex)

    return { varieties: dataResponse, pagination }
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function getVarietyById(id: string) {
  try {
    const variety = await Variety.findOne({ where: { id, isDeleted: false } })
    if (!variety) {
      throw responseStatus.responseNotFound404("Không tìm thấy giống cá")
    }
    return variety
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function createVariety(newVariety: CreateVariety) {
  try {
    const createdVariety = await Variety.create({
      name: newVariety.name,
      description: newVariety.description
    })
    return createdVariety
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function updateVariety(id: string, updatedVariety: UpdateVariety) {
  try {
    const variety = await Variety.findOne({ where: { id, isDeleted: false } })
    if (!variety) {
      throw responseStatus.responseNotFound404("Không tìm thấy giống cá")
    }

    variety.name = updatedVariety.name || variety.name
    variety.description = updatedVariety.description || variety.description

    await variety.save()
    return "Cập nhật giống cá thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function deleteVariety(id: string) {
  try {
    const variety = await Variety.findOne({ where: { id: id, isDeleted: false } })
    if (!variety) {
      throw responseStatus.responseNotFound404("Không tìm thấy giống cá")
    }

    variety.isDeleted = true
    await variety.save()

    return "Xóa giống cá thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

export default {
  getVarieties,
  getVarietyById,
  createVariety,
  updateVariety,
  deleteVariety
}
