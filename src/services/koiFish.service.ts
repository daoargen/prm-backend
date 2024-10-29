import { Op } from "sequelize"

import responseStatus from "~/constants/responseStatus"
import { CreateFishImageUrl, CreateKoiFish, CreateKoiFishElement, UpdateKoiFish } from "~/constants/type"
import { Element } from "~/models/element.model"
import { FishImageUrl } from "~/models/fishImageUrl.model"
import { FishReview } from "~/models/fishReview.model"
import { KoiFish, KoiFishInstance } from "~/models/koiFish.model"
import { KoiFishElement } from "~/models/koiFishElement.model"
import { Supplier } from "~/models/supplier.model"
import { Variety } from "~/models/variety.model"
import { calculatePagination } from "~/utils/calculatePagination.utilt"
import { formatModelDate } from "~/utils/formatTimeModel.util"
import { logNonCustomError } from "~/utils/logNonCustomError.util"

import fishImageUrlService from "./fishImageUrl.service"
import koiFishElementService from "./koiFishElement.service"

async function getKoiFishes(pageIndex: number, pageSize: number, keyword: string, yob: number) {
  try {
    const whereCondition: any = { isDeleted: false }

    if (keyword) {
      whereCondition[Op.or] = [{ name: { [Op.like]: `%${keyword}%` } }, { description: { [Op.like]: `%${keyword}%` } }]
    }

    if (yob) {
      const destiny = getDestinyByYearOfBirth(yob)
      console.log(destiny)
      const element = await Element.findOne({
        where: {
          name: destiny,
          isDeleted: false
        }
      })
      console.log(element)
      if (element && element.id) {
        const elementId = element.id
        const koiFishIdsWithElement = await KoiFishElement.findAll({
          where: { elementId, isDeleted: false },
          attributes: ["koiFishId"]
        }).then((results) => results.map((result) => result.koiFishId))

        whereCondition.id = {
          [Op.in]: koiFishIdsWithElement
        }
      }
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
    const koiFishElements = await KoiFishElement.findAll({
      where: { koiFishId: koiFish.id, isDeleted: false },
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
      where: { koiFishId: koiFish.id, isDeleted: false },
      attributes: ["id", "imageUrl"]
    })
    const fishReviews = await FishReview.findAll({
      where: { koiFishId: koiFish.id, isDeleted: false },
      attributes: ["phoneNumber", "content"]
    })
    const supplier = await Supplier.findOne({
      where: { id: koiFish.supplierId, isDeleted: false },
      attributes: ["name", "description", "phoneNumber", "email"]
    })
    return {
      ...koiFish.toJSON(),
      elements: elements,
      imageUrls: imageUrls,
      fishReviews: fishReviews,
      supplier: supplier
    }
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

function getDestinyByYearOfBirth(yearOfBirth: number): string {
  type HeavenlyStem = "Giap" | "At" | "Binh" | "Dinh" | "Mau" | "Ky" | "Canh" | "Tan" | "Nham" | "Quy"
  type EarthlyBranch = "Ty" | "Suu" | "Dan" | "Mao" | "Thin" | "Ti" | "Ngo" | "Mui" | "Than" | "Dau" | "Tuat" | "Hoi"

  const heavenlyStemValues: Record<HeavenlyStem, number> = {
    Giap: 1,
    At: 1,
    Binh: 2,
    Dinh: 2,
    Mau: 3,
    Ky: 3,
    Canh: 4,
    Tan: 4,
    Nham: 5,
    Quy: 5
  }

  const earthlyBranchValues: Record<EarthlyBranch, number> = {
    Ty: 0,
    Suu: 0,
    Ngo: 0,
    Mui: 0,
    Dan: 1,
    Mao: 1,
    Than: 1,
    Dau: 1,
    Thin: 2,
    Ti: 2,
    Tuat: 2,
    Hoi: 2
  }

  const destinyValues = ["Metal", "Water", "Fire", "Earth", "Wood"]

  const heavenlyStems: HeavenlyStem[] = ["Giap", "At", "Binh", "Dinh", "Mau", "Ky", "Canh", "Tan", "Nham", "Quy"]
  const earthlyBranches: EarthlyBranch[] = [
    "Ty",
    "Suu",
    "Dan",
    "Mao",
    "Thin",
    "Ti",
    "Ngo",
    "Mui",
    "Than",
    "Dau",
    "Tuat",
    "Hoi"
  ]

  // Tính chỉ số Thiên Can
  const heavenlyStemIndex = (yearOfBirth - 4) % 10

  // Tính chỉ số Địa Chi
  const earthlyBranchIndex = (yearOfBirth - 4) % 12

  const heavenlyStem = heavenlyStems[heavenlyStemIndex]
  const earthlyBranch = earthlyBranches[earthlyBranchIndex]

  let destinyValue = heavenlyStemValues[heavenlyStem] + earthlyBranchValues[earthlyBranch]
  if (destinyValue > 5) {
    destinyValue -= 5
  }
  console.log(destinyValues[destinyValue - 1])
  return destinyValues[destinyValue - 1]
}

export default {
  getKoiFishes,
  getKoiFishById,
  createKoiFish,
  updateKoiFish,
  deleteKoiFish,
  getDestinyByYearOfBirth
}
