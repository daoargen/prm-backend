import { Op } from "sequelize"

import responseStatus from "~/constants/responseStatus"
import { CreateOrderDetail, UpdateOrderDetail, UpdateUserDetail } from "~/constants/type"
import { KoiFish } from "~/models/koiFish.model"
import { OrderDetail, OrderDetailInstance } from "~/models/orderDetail.model"
import { Product } from "~/models/product.model"
import { calculatePagination } from "~/utils/calculatePagination.utilt"
import { formatModelDate } from "~/utils/formatTimeModel.util"
import { logNonCustomError } from "~/utils/logNonCustomError.util"

async function getOrderDetails(pageIndex: number, pageSize: number) {
  try {
    const whereCondition: any = { isDeleted: false }

    const { count, rows: orderDetails } = await OrderDetail.findAndCountAll({
      where: whereCondition,
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
      order: [["createdAt", "DESC"]]
    })

    const dataResponse = orderDetails.map((orderDetail) => formatModelDate(orderDetail.toJSON()))
    const pagination = calculatePagination(count, pageSize, pageIndex)

    return { orderDetails: dataResponse, pagination }
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function getOrderDetailById(id: string) {
  try {
    const orderDetail = await OrderDetail.findOne({ where: { id, isDeleted: false } })
    if (!orderDetail) {
      throw responseStatus.responseNotFound404("Không tìm thấy chi tiết đơn hàng")
    }
    return orderDetail
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function createOrderDetail(orderId: string, newOrderDetail: CreateOrderDetail) {
  try {
    let unitPrice = 0

    // Tìm unitPrice dựa trên type
    if (newOrderDetail.type === "KOIFISH" && newOrderDetail.koiFishId) {
      const koiFish = await KoiFish.findByPk(newOrderDetail.koiFishId)
      if (!koiFish) {
        throw responseStatus.responseNotFound404("Không tìm thấy cá Koi với ID đã cho.")
      }
      unitPrice = koiFish.price
      koiFish.isSold = true
      await koiFish.save()
    } else if (newOrderDetail.type === "PRODUCT" && newOrderDetail.productId) {
      const product = await Product.findByPk(newOrderDetail.productId)
      if (!product) {
        throw responseStatus.responseNotFound404("Không tìm thấy sản phẩm với ID đã cho.")
      }
      unitPrice = product.price
      product.stock -= newOrderDetail.quantity
      await product.save()
    } else {
      // Xử lý trường hợp type không hợp lệ hoặc thiếu ID
      throw responseStatus.responseBadRequest400("Loại sản phẩm không hợp lệ hoặc thiếu ID sản phẩm.")
    }

    // Tính totalPrice
    const totalPrice = unitPrice * newOrderDetail.quantity

    const createdOrderDetail = await OrderDetail.create({
      orderId: orderId,
      koiFishId: newOrderDetail.koiFishId,
      productId: newOrderDetail.productId,
      type: newOrderDetail.type,
      unitPrice: unitPrice, // Lưu unitPrice vào database
      quantity: newOrderDetail.quantity,
      totalPrice: totalPrice // Lưu totalPrice vào database
    })

    return createdOrderDetail
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function updateOrderDetail(id: string, updatedOrderDetail: UpdateOrderDetail) {
  try {
    const orderDetail = await OrderDetail.findOne({ where: { id, isDeleted: false } })
    if (!orderDetail) {
      throw responseStatus.responseNotFound404("Không tìm thấy chi tiết đơn hàng")
    }

    orderDetail.quantity = updatedOrderDetail.quantity || orderDetail.quantity
    orderDetail.totalPrice = orderDetail.quantity * orderDetail.unitPrice

    await orderDetail.save()
    return "Cập nhật chi tiết đơn hàng thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function deleteOrderDetail(id: string) {
  try {
    const orderDetail = await OrderDetail.findOne({ where: { id, isDeleted: false } })
    if (!orderDetail) {
      throw responseStatus.responseNotFound404("Không tìm thấy chi tiết đơn hàng")
    }

    orderDetail.isDeleted = true
    await orderDetail.save()

    return "Xóa chi tiết đơn hàng thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

export default {
  getOrderDetails,
  getOrderDetailById,
  createOrderDetail,
  updateOrderDetail,
  deleteOrderDetail
}
