import { Request, Response } from "express"

import responseStatus from "~/constants/responseStatus"
import { CreateCategory, UpdateCategory } from "~/constants/type"
import categoryService from "~/services/category.service"

async function getCategories(req: Request, res: Response) {
  try {
    const pageIndex = parseInt(req.query.page_index as string) || 1
    const pageSize = parseInt(req.query.page_size as string) || 10
    const keyword = req.query.keyword as string

    const { categories, pagination } = await categoryService.getCategories(pageIndex, pageSize, keyword)
    return res.json(responseStatus.responseData200("Get categories successfully!", categories, pagination))
  } catch (error) {
    return res.json(error)
  }
}

async function getCategoryById(req: Request, res: Response) {
  try {
    const id = req.params.id
    if (!id) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataResponse = await categoryService.getCategoryById(id)
    return res.json(responseStatus.responseData200("Get category successfully!", dataResponse))
  } catch (error) {
    return res.json(error)
  }
}

async function createCategory(req: Request, res: Response) {
  try {
    const { name, description } = req.body
    if (!name) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataRequest: CreateCategory = {
      name,
      description
    }

    const dataResponse = await categoryService.createCategory(dataRequest)
    return res.json(responseStatus.responseCreateSuccess201("Create category successfully!", dataResponse))
  } catch (error) {
    return res.json(error)
  }
}

async function updateCategory(req: Request, res: Response) {
  try {
    const id = req.params.id
    const { name, description } = req.body
    if (!id) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataRequest: UpdateCategory = {
      name,
      description
    }
    const dataResponse = await categoryService.updateCategory(id, dataRequest)
    return res.json(responseStatus.responseMessage200(dataResponse))
  } catch (error) {
    return res.json(error)
  }
}

async function deleteCategory(req: Request, res: Response) {
  try {
    const id = req.params.id
    if (!id) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataResponse = await categoryService.deleteCategory(id)
    return res.json(responseStatus.responseMessage200(dataResponse))
  } catch (error) {
    return res.json(error)
  }
}

export default {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
}
