import { Request, Response } from "express"

import responseStatus from "~/constants/responseStatus"
import { CreateVariety, UpdateVariety } from "~/constants/type"
import varietyService from "~/services/variety.service"

async function getVarieties(req: Request, res: Response) {
  try {
    const pageIndex = parseInt(req.query.page_index as string) || 1
    const pageSize = parseInt(req.query.page_size as string) || 10
    const keyword = req.query.keyword as string

    const { varieties, pagination } = await varietyService.getVarieties(pageIndex, pageSize, keyword)
    return res.json(responseStatus.responseData200("Get varieties successfully!", varieties, pagination))
  } catch (error) {
    return res.json(error)
  }
}

async function getVarietyById(req: Request, res: Response) {
  try {
    const id = req.params.id
    if (!id) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataResponse = await varietyService.getVarietyById(id)
    return res.json(responseStatus.responseData200("Get variety successfully!", dataResponse))
  } catch (error) {
    return res.json(error)
  }
}

async function createVariety(req: Request, res: Response) {
  try {
    const { name, description } = req.body
    if (!name) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataRequest: CreateVariety = {
      name,
      description
    }

    const dataResponse = await varietyService.createVariety(dataRequest)
    return res.json(responseStatus.responseCreateSuccess201("Create variety successfully!", dataResponse))
  } catch (error) {
    return res.json(error)
  }
}

async function updateVariety(req: Request, res: Response) {
  try {
    const id = req.params.id
    const { name, description } = req.body
    if (!id) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataRequest: UpdateVariety = {
      name,
      description
    }
    const dataResponse = await varietyService.updateVariety(id, dataRequest)
    return res.json(responseStatus.responseMessage200(dataResponse))
  } catch (error) {
    return res.json(error)
  }
}

async function deleteVariety(req: Request, res: Response) {
  try {
    const id = req.params.id
    if (!id) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataResponse = await varietyService.deleteVariety(id)
    return res.json(responseStatus.responseMessage200(dataResponse))
  } catch (error) {
    return res.json(error)
  }
}

export default {
  getVarieties,
  getVarietyById,
  createVariety,
  updateVariety,
  deleteVariety
}
