import { Request, Response } from "express"

import responseStatus from "~/constants/responseStatus"
import { CreateSupplier, UpdateSupplier } from "~/constants/type"
import supplierService from "~/services/supplier.service"

async function getSuppliers(req: Request, res: Response) {
  try {
    const pageIndex = parseInt(req.query.page_index as string) || 1
    const pageSize = parseInt(req.query.page_size as string) || 10
    const keyword = req.query.keyword as string

    const { suppliers, pagination } = await supplierService.getSuppliers(pageIndex, pageSize, keyword)
    return res.json(responseStatus.responseData200("Get suppliers successfully!", suppliers, pagination))
  } catch (error) {
    return res.json(error)
  }
}

async function getSupplierById(req: Request, res: Response) {
  try {
    const id = req.params.id
    if (!id) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataResponse = await supplierService.getSupplierById(id)
    return res.json(responseStatus.responseData200("Get supplier successfully!", dataResponse))
  } catch (error) {
    return res.json(error)
  }
}

async function createSupplier(req: Request, res: Response) {
  try {
    const { name, description, phoneNumber, email } = req.body
    if (!name) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataRequest: CreateSupplier = {
      name,
      description,
      phoneNumber,
      email
    }

    const dataResponse = await supplierService.createSupplier(dataRequest)
    return res.json(responseStatus.responseCreateSuccess201("Create supplier successfully!", dataResponse))
  } catch (error) {
    return res.json(error)
  }
}

async function updateSupplier(req: Request, res: Response) {
  try {
    const id = req.params.id
    const { name, description, phoneNumber, email } = req.body
    if (!id) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataRequest: UpdateSupplier = {
      name,
      description,
      phoneNumber,
      email
    }
    const dataResponse = await supplierService.updateSupplier(id, dataRequest)
    return res.json(responseStatus.responseMessage200(dataResponse))
  } catch (error) {
    return res.json(error)
  }
}

async function deleteSupplier(req: Request, res: Response) {
  try {
    const id = req.params.id
    if (!id) {
      return res.json(responseStatus.responseBadRequest400("Missing required fields"))
    }

    const dataResponse = await supplierService.deleteSupplier(id)
    return res.json(responseStatus.responseMessage200(dataResponse))
  } catch (error) {
    return res.json(error)
  }
}

export default {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
}
