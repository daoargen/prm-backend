import { Op } from "sequelize"

import responseStatus from "~/constants/responseStatus"
import { CreateKoiFishElement, UpdateKoiFishElement } from "~/constants/type"
import { KoiFishElement, KoiFishElementInstance } from "~/models/koiFishElement.model"
import { calculatePagination } from "~/utils/calculatePagination.utilt"
import { formatModelDate } from "~/utils/formatTimeModel.util"
import { logNonCustomError } from "~/utils/logNonCustomError.util"

async function getKoiFishElements(pageIndex: number, pageSize: number) {
  try {
    const { count, rows: koiFishElements } = await KoiFishElement.findAndCountAll({
      where: { isDeleted: false },
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
      order: [["createdAt", "DESC"]]
    })

    const dataResponse = koiFishElements.map((koiFishElement) => formatModelDate(koiFishElement.toJSON()))
    const pagination = calculatePagination(count, pageSize, pageIndex)

    return { koiFishElements: dataResponse, pagination }
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function getKoiFishElementById(id: string) {
  try {
    const koiFishElement = await KoiFishElement.findOne({ where: { id, isDeleted: false } })
    if (!koiFishElement) {
      throw responseStatus.responseNotFound404("Không tìm thấy nguyên tố cá Koi")
    }
    return koiFishElement
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function createKoiFishElement(newKoiFishElement: CreateKoiFishElement) {
  try {
    const createdKoiFishElement = await KoiFishElement.create({
      koiFishId: newKoiFishElement.koiFishId,
      elementId: newKoiFishElement.elementId
    })
    return createdKoiFishElement
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function updateKoiFishElement(id: string, updatedKoiFishElement: UpdateKoiFishElement) {
  try {
    const koiFishElement = await KoiFishElement.findOne({ where: { id, isDeleted: false } })
    if (!koiFishElement) {
      throw responseStatus.responseNotFound404("Không tìm thấy nguyên tố cá Koi")
    }

    koiFishElement.koiFishId = updatedKoiFishElement.koiFishId || koiFishElement.koiFishId
    koiFishElement.elementId = updatedKoiFishElement.elementId || koiFishElement.elementId

    await koiFishElement.save()
    return "Cập nhật nguyên tố cá Koi thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function deleteKoiFishElement(id: string) {
  try {
    const koiFishElement = await KoiFishElement.findOne({ where: { id, isDeleted: false } })
    if (!koiFishElement) {
      throw responseStatus.responseNotFound404("Không tìm thấy nguyên tố cá Koi")
    }

    koiFishElement.isDeleted = true
    await koiFishElement.save()

    return "Xóa nguyên tố cá Koi thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

export default {
  getKoiFishElements,
  getKoiFishElementById,
  createKoiFishElement,
  updateKoiFishElement,
  deleteKoiFishElement
}
