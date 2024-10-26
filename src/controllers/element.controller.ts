import { Request, Response } from "express"

import responseStatus from "~/constants/responseStatus"
import { CreateElement, UpdateElement } from "~/constants/type"
import elementService from "~/services/element.service"

async function getElements(req: Request, res: Response) {
  try {
    const pageIndex = parseInt(req.query.page_index as string) || 1
    const pageSize = parseInt(req.query.page_size as string) || 10
    const keyword = req.query.keyword as string

    const { elements, pagination } = await elementService.getElements(pageIndex, pageSize, keyword)
    return res.json(responseStatus.responseData200("Get elements successfully!", elements, pagination))
  } catch (error) {
    return res.json(error)
  }
}

async function getElementById(req: Request, res: Response) {
  try {
    const id = req.params.id
    if (!id) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataResponse = await elementService.getElementById(id)
    return res.json(responseStatus.responseData200("Get element successfully!", dataResponse))
  } catch (error) {
    return res.json(error)
  }
}

async function createElement(req: Request, res: Response) {
  try {
    const { name, imageUrl } = req.body
    if (!name || !imageUrl) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataRequest: CreateElement = {
      name,
      imageUrl
    }

    const dataResponse = await elementService.createElement(dataRequest)
    return res.json(responseStatus.responseCreateSuccess201("Create element successfully!", dataResponse))
  } catch (error) {
    return res.json(error)
  }
}

async function updateElement(req: Request, res: Response) {
  try {
    const id = req.params.id
    const { name, imageUrl } = req.body
    if (!id) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataRequest: UpdateElement = {
      name,
      imageUrl
    }
    const dataResponse = await elementService.updateElement(id, dataRequest)
    return res.json(responseStatus.responseMessage200(dataResponse))
  } catch (error) {
    return res.json(error)
  }
}

async function deleteElement(req: Request, res: Response) {
  try {
    const id = req.params.id
    if (!id) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataResponse = await elementService.deleteElement(id)
    return res.json(responseStatus.responseMessage200(dataResponse))
  } catch (error) {
    return res.json(error)
  }
}

export default {
  getElements,
  getElementById,
  createElement,
  updateElement,
  deleteElement
}
