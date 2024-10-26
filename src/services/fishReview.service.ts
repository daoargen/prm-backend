import { Op } from "sequelize"

import responseStatus from "~/constants/responseStatus"
import { CreateFishReview, UpdateFishReview } from "~/constants/type"
import { FishReview, FishReviewInstance } from "~/models/fishReview.model"
import { calculatePagination } from "~/utils/calculatePagination.utilt"
import { formatModelDate } from "~/utils/formatTimeModel.util"
import { logNonCustomError } from "~/utils/logNonCustomError.util"

async function getFishReviews(pageIndex: number, pageSize: number) {
  try {
    const whereCondition: any = { isDeleted: false }

    const { count, rows: fishReviews } = await FishReview.findAndCountAll({
      where: whereCondition,
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
      order: [["createdAt", "DESC"]]
    })

    const dataResponse = fishReviews.map((fishReview) => formatModelDate(fishReview.toJSON()))
    const pagination = calculatePagination(count, pageSize, pageIndex)

    return { fishReviews: dataResponse, pagination }
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function getFishReviewById(id: string) {
  try {
    const fishReview = await FishReview.findOne({ where: { id, isDeleted: false } })
    if (!fishReview) {
      throw responseStatus.responseNotFound404("Không tìm thấy đánh giá cá")
    }
    return fishReview
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function createFishReview(newFishReview: CreateFishReview) {
  try {
    const createdFishReview = await FishReview.create({
      userId: newFishReview.userId,
      koiFishId: newFishReview.koiFishId,
      content: newFishReview.content
    })
    return createdFishReview
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function updateFishReview(id: string, updatedFishReview: UpdateFishReview) {
  try {
    const fishReview = await FishReview.findOne({ where: { id, isDeleted: false } })
    if (!fishReview) {
      throw responseStatus.responseNotFound404("Không tìm thấy đánh giá cá")
    }

    fishReview.userId = updatedFishReview.userId || fishReview.userId
    fishReview.koiFishId = updatedFishReview.koiFishId || fishReview.koiFishId
    fishReview.content = updatedFishReview.content || fishReview.content

    await fishReview.save()
    return "Cập nhật đánh giá cá thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function deleteFishReview(id: string) {
  try {
    const fishReview = await FishReview.findOne({ where: { id, isDeleted: false } })
    if (!fishReview) {
      throw responseStatus.responseNotFound404("Không tìm thấy đánh giá cá")
    }

    fishReview.isDeleted = true
    await fishReview.save()

    return "Xóa đánh giá cá thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

export default {
  getFishReviews,
  getFishReviewById,
  createFishReview,
  updateFishReview,
  deleteFishReview
}
