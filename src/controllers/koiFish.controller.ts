import { Request, Response } from "express"

import responseStatus from "~/constants/responseStatus"
import { CreateKoiFish, UpdateKoiFish } from "~/constants/type"
import koiFishService from "~/services/koiFish.service"

async function getKoiFishes(req: Request, res: Response) {
  try {
    const pageIndex = parseInt(req.query.page_index as string) || 1
    const pageSize = parseInt(req.query.page_size as string) || 10
    const keyword = req.query.keyword as string
    const yob = parseInt(req.query.yob as string)

    const { koiFishes, pagination } = await koiFishService.getKoiFishes(pageIndex, pageSize, keyword, yob)
    return res.json(responseStatus.responseData200("Get koi fishes successfully!", koiFishes, pagination))
  } catch (error) {
    return res.json(error)
  }
}

async function getKoiFishById(req: Request, res: Response) {
  try {
    const id = req.params.id
    if (!id) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataResponse = await koiFishService.getKoiFishById(id)
    return res.json(responseStatus.responseData200("Get koi fish successfully!", dataResponse))
  } catch (error) {
    return res.json(error)
  }
}

async function createKoiFish(req: Request, res: Response) {
  try {
    const { varietyId, name, description, gender, isSold, supplierId, price, size, age, elementIds, imageUrls } =
      req.body
    if (!varietyId || !name || !price || !supplierId) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataRequest: CreateKoiFish = {
      varietyId,
      name,
      description,
      gender,
      isSold,
      supplierId,
      price,
      size,
      age,
      elementIds,
      imageUrls
    }

    const dataResponse = await koiFishService.createKoiFish(dataRequest)
    return res.json(responseStatus.responseCreateSuccess201("Create koi fish successfully!", dataResponse))
  } catch (error) {
    return res.json(error)
  }
}

async function updateKoiFish(req: Request, res: Response) {
  try {
    const id = req.params.id
    const { varietyId, name, description, gender, isSold, supplierId, price, size } = req.body
    if (!id) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataRequest: UpdateKoiFish = {
      varietyId,
      name,
      description,
      gender,
      isSold,
      supplierId,
      price,
      size
    }
    const dataResponse = await koiFishService.updateKoiFish(id, dataRequest)
    return res.json(responseStatus.responseMessage200(dataResponse))
  } catch (error) {
    return res.json(error)
  }
}

async function deleteKoiFish(req: Request, res: Response) {
  try {
    const id = req.params.id
    if (!id) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataResponse = await koiFishService.deleteKoiFish(id)
    return res.json(responseStatus.responseMessage200(dataResponse))
  } catch (error) {
    return res.json(error)
  }
}

export default {
  getKoiFishes,
  getKoiFishById,
  createKoiFish,
  updateKoiFish,
  deleteKoiFish
}
