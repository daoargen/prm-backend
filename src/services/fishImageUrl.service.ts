import { Op } from "sequelize"

import responseStatus from "~/constants/responseStatus"
import { CreateFishImageUrl, UpdateFishImageUrl } from "~/constants/type"
import { FishImageUrl, FishImageUrlInstance } from "~/models/fishImageUrl.model"
import { calculatePagination } from "~/utils/calculatePagination.utilt"
import { formatModelDate } from "~/utils/formatTimeModel.util"
import { logNonCustomError } from "~/utils/logNonCustomError.util"

async function getFishImageUrls(pageIndex: number, pageSize: number) {
  try {
    const whereCondition: any = { isDeleted: false }

    const { count, rows: fishImageUrls } = await FishImageUrl.findAndCountAll({
      where: whereCondition,
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
      order: [["createdAt", "DESC"]]
    })

    const dataResponse = fishImageUrls.map((fishImageUrl) => formatModelDate(fishImageUrl.toJSON()))
    const pagination = calculatePagination(count, pageSize, pageIndex)

    return { fishImageUrls: dataResponse, pagination }
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function getFishImageUrlById(id: string) {
  try {
    const fishImageUrl = await FishImageUrl.findOne({ where: { id, isDeleted: false } })
    if (!fishImageUrl) {
      throw responseStatus.responseNotFound404("Không tìm thấy ảnh cá")
    }
    return fishImageUrl
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function createFishImageUrl(newFishImageUrl: CreateFishImageUrl) {
  try {
    const createdFishImageUrl = await FishImageUrl.create({
      koiFishId: newFishImageUrl.koiFishId,
      imageUrl: newFishImageUrl.imageUrl
    })
    return createdFishImageUrl
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function updateFishImageUrl(id: string, updatedFishImageUrl: UpdateFishImageUrl) {
  try {
    const fishImageUrl = await FishImageUrl.findOne({ where: { id, isDeleted: false } })
    if (!fishImageUrl) {
      throw responseStatus.responseNotFound404("Không tìm thấy ảnh cá")
    }

    fishImageUrl.koiFishId = updatedFishImageUrl.koiFishId || fishImageUrl.koiFishId
    fishImageUrl.imageUrl = updatedFishImageUrl.imageUrl || fishImageUrl.imageUrl

    await fishImageUrl.save()
    return "Cập nhật ảnh cá thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function deleteFishImageUrl(id: string) {
  try {
    const fishImageUrl = await FishImageUrl.findOne({ where: { id, isDeleted: false } })
    if (!fishImageUrl) {
      throw responseStatus.responseNotFound404("Không tìm thấy ảnh cá")
    }

    fishImageUrl.isDeleted = true
    await fishImageUrl.save()

    return "Xóa ảnh cá thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

export default {
  getFishImageUrls,
  getFishImageUrlById,
  createFishImageUrl,
  updateFishImageUrl,
  deleteFishImageUrl
}
