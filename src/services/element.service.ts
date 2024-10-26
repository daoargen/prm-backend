import { Op } from "sequelize"

import responseStatus from "~/constants/responseStatus"
import { CreateElement, UpdateElement } from "~/constants/type"
import { Element, ElementInstance } from "~/models/element.model"
import { calculatePagination } from "~/utils/calculatePagination.utilt"
import { formatModelDate } from "~/utils/formatTimeModel.util"
import { logNonCustomError } from "~/utils/logNonCustomError.util"

async function getElements(pageIndex: number, pageSize: number, keyword: string) {
  try {
    const whereCondition: any = { isDeleted: false }

    if (keyword) {
      whereCondition.name = { [Op.like]: `%${keyword}%` }
    }

    const { count, rows: elements } = await Element.findAndCountAll({
      where: whereCondition,
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
      order: [["createdAt", "DESC"]]
    })

    const dataResponse = elements.map((element) => formatModelDate(element.toJSON()))
    const pagination = calculatePagination(count, pageSize, pageIndex)

    return { elements: dataResponse, pagination }
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function getElementById(id: string) {
  try {
    const element = await Element.findOne({ where: { id, isDeleted: false } })
    if (!element) {
      throw responseStatus.responseNotFound404("Không tìm thấy nguyên tố")
    }
    return element
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function createElement(newElement: CreateElement) {
  try {
    const createdElement = await Element.create({
      name: newElement.name,
      imageUrl: newElement.imageUrl
    })
    return createdElement
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function updateElement(id: string, updatedElement: UpdateElement) {
  try {
    const element = await Element.findOne({ where: { id, isDeleted: false } })
    if (!element) {
      throw responseStatus.responseNotFound404("Không tìm thấy nguyên tố")
    }

    element.name = updatedElement.name || element.name
    element.imageUrl = updatedElement.imageUrl || element.imageUrl

    await element.save()
    return "Cập nhật nguyên tố thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function deleteElement(id: string) {
  try {
    const element = await Element.findOne({ where: { id, isDeleted: false } })
    if (!element) {
      throw responseStatus.responseNotFound404("Không tìm thấy nguyên tố")
    }

    element.isDeleted = true
    await element.save()

    return "Xóa nguyên tố thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

export default {
  getElements,
  getElementById,
  createElement,
  updateElement,
  deleteElement
}
