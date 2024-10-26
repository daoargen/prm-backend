import { Op } from "sequelize"

import responseStatus from "~/constants/responseStatus"
import { CreateFishImageUrl, CreateKoiFish, CreateKoiFishElement, UpdateKoiFish } from "~/constants/type"
import { Element } from "~/models/element.model"
import { FishImageUrl } from "~/models/fishImageUrl.model"
import { KoiFish, KoiFishInstance } from "~/models/koiFish.model"
import { KoiFishElement } from "~/models/koiFishElement.model"
import { Variety } from "~/models/variety.model"
import { calculatePagination } from "~/utils/calculatePagination.utilt"
import { formatModelDate } from "~/utils/formatTimeModel.util"
import { logNonCustomError } from "~/utils/logNonCustomError.util"

import fishImageUrlService from "./fishImageUrl.service"
import koiFishElementService from "./koiFishElement.service"

async function getKoiFishes(pageIndex: number, pageSize: number, keyword: string) {
  try {
    const whereCondition: any = { isDeleted: false }

    if (keyword) {
      whereCondition[Op.or] = [{ name: { [Op.like]: `%${keyword}%` } }, { description: { [Op.like]: `%${keyword}%` } }]
    }

    const { count, rows: koiFishes } = await KoiFish.findAndCountAll({
      where: whereCondition,
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Variety,
          as: "variety",
          attributes: ["name", "description"]
        }
      ]
    })

    let dataResponse: any = []
    if (koiFishes.length > 0) {
      const koiFishIds = koiFishes.map((koifish) => koifish.id).filter((id): id is string => id !== undefined)
      const koiFishElements = await KoiFishElement.findAll({
        where: { koiFishId: koiFishIds, isDeleted: false },
        attributes: ["koiFishId", "elementId"]
      })
      const elementIds = koiFishElements
        .map((koiFishElement) => koiFishElement.elementId)
        .filter((elementId): elementId is string => elementId !== undefined)
      const elements = await Element.findAll({
        where: { id: elementIds, isDeleted: false },
        attributes: ["id", "name", "imageUrl"]
      })
      const imageUrls = await FishImageUrl.findAll({
        where: { koiFishId: koiFishIds, isDeleted: false },
        attributes: ["id", "koiFishId", "imageUrl"]
      })
      const formatKoiFishs = koiFishes.map((koiFish) => {
        // Lấy danh sách koiFishElement có koiFishId tương ứng
        const relatedKoiFishElements = koiFishElements.filter((kfe) => kfe.koiFishId === koiFish.id)
        // Lấy danh sách element tương ứng từ relatedKoiFishElements
        const relatedElements = relatedKoiFishElements.map((kfe) => {
          return elements.find((element) => element.id === kfe.elementId)
        })
        const relatedImageUrls = imageUrls.filter((kfi) => kfi.koiFishId === koiFish.id).map((kfi) => kfi.imageUrl)
        return {
          ...koiFish.toJSON(),
          elements: relatedElements,
          imageUrls: relatedImageUrls
        }
      })
      dataResponse = formatKoiFishs.map((koiFish: any) => formatModelDate(koiFish))
    }

    // const dataResponse = koiFishes.map((koiFish) => formatModelDate(koiFish.toJSON()))
    const pagination = calculatePagination(count, pageSize, pageIndex)

    return { koiFishes: dataResponse, pagination }
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function getKoiFishById(id: string) {
  try {
    const koiFish = await KoiFish.findOne({ where: { id, isDeleted: false } })
    if (!koiFish) {
      throw responseStatus.responseNotFound404("Không tìm thấy cá Koi")
    }
    return koiFish
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function createKoiFish(newKoiFish: CreateKoiFish) {
  try {
    const createdKoiFish = await KoiFish.create({
      varietyId: newKoiFish.varietyId,
      name: newKoiFish.name,
      description: newKoiFish.description,
      gender: newKoiFish.gender,
      isSold: newKoiFish.isSold,
      supplierId: newKoiFish.supplierId,
      price: newKoiFish.price,
      size: newKoiFish.size
    })

    if (!createdKoiFish.id) {
      throw responseStatus.responseBadRequest400("Tạo cá koi thất bại")
    } else {
      if (newKoiFish.elementIds) {
        newKoiFish.elementIds.map(async (elementId) => {
          const newKoiFishElement: CreateKoiFishElement = {
            koiFishId: createdKoiFish.id!,
            elementId: elementId
          }
          await koiFishElementService.createKoiFishElement(newKoiFishElement)
        })
      }
      if (newKoiFish.imageUrls) {
        newKoiFish.imageUrls.map(async (imageUrl) => {
          const newKoiFishImageUrl: CreateFishImageUrl = {
            koiFishId: createdKoiFish.id!,
            imageUrl: imageUrl
          }
          await fishImageUrlService.createFishImageUrl(newKoiFishImageUrl)
        })
      }
    }

    return createdKoiFish
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function updateKoiFish(id: string, updatedKoiFish: UpdateKoiFish) {
  try {
    const koiFish = await KoiFish.findOne({ where: { id, isDeleted: false } })
    if (!koiFish) {
      throw responseStatus.responseNotFound404("Không tìm thấy cá Koi")
    }

    koiFish.varietyId = updatedKoiFish.varietyId || koiFish.varietyId
    koiFish.name = updatedKoiFish.name || koiFish.name
    koiFish.description = updatedKoiFish.description || koiFish.description
    koiFish.gender = updatedKoiFish.gender || koiFish.gender
    koiFish.isSold = updatedKoiFish.isSold || koiFish.isSold
    koiFish.supplierId = updatedKoiFish.supplierId || koiFish.supplierId
    koiFish.price = updatedKoiFish.price || koiFish.price
    koiFish.size = updatedKoiFish.size || koiFish.size

    await koiFish.save()
    return "Cập nhật cá Koi thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function deleteKoiFish(id: string) {
  try {
    const koiFish = await KoiFish.findOne({ where: { id, isDeleted: false } })
    if (!koiFish) {
      throw responseStatus.responseNotFound404("Không tìm thấy cá Koi")
    }

    koiFish.isDeleted = true
    await koiFish.save()

    return "Xóa cá Koi thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

export default {
  getKoiFishes,
  getKoiFishById,
  createKoiFish,
  updateKoiFish,
  deleteKoiFish
}
