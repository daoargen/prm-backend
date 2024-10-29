import { Op } from "sequelize"

import responseStatus from "~/constants/responseStatus"
import { CreateOrder, CreateOrderDetail, UpdateOrder } from "~/constants/type"
import { Order, OrderInstance } from "~/models/order.model"
import { OrderDetail } from "~/models/orderDetail.model"
import { calculatePagination } from "~/utils/calculatePagination.utilt"
import { formatModelDate } from "~/utils/formatTimeModel.util"
import { logNonCustomError } from "~/utils/logNonCustomError.util"

import orderDetailService from "./orderDetail.service"

async function getOrders(pageIndex: number, pageSize: number, keyword: string) {
  try {
    const whereCondition: any = { isDeleted: false }

    if (keyword) {
      // Add conditions for keyword search if needed
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereCondition,
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
      order: [["createdAt", "DESC"]]
    })

    const dataResponse = orders.map((order) => formatModelDate(order.toJSON()))
    const pagination = calculatePagination(count, pageSize, pageIndex)

    return { orders: dataResponse, pagination }
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function getOrderById(id: string) {
  try {
    const order = await Order.findOne({ where: { id, isDeleted: false } })
    if (!order) {
      throw responseStatus.responseNotFound404("Không tìm thấy đơn hàng")
    }
    return order
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function createOrder(newOrder: CreateOrder) {
  try {
    const createdOrder = await Order.create({
      phoneNumber: newOrder.phoneNumber,
      status: "PENDING_CONFIRMATION",
      totalAmount: 0
    })
    if (!createdOrder.id) {
      throw responseStatus.responseBadRequest400("Tạo hoá đơn thất bại")
    }
    if (!createdOrder.id) {
      throw responseStatus.responseBadRequest400("Tạo hoá đơn thất bại")
    }

    // Duyệt qua từng orderDetail để kiểm tra
    newOrder.orderDetails.map((orderDetail) => {
      // Kiểm tra type
      if (orderDetail.type !== "KOIFISH" && orderDetail.type !== "PRODUCT") {
        throw responseStatus.responseBadRequest400(
          "Loại sản phẩm không hợp lệ. Chỉ chấp nhận 'KOIFISH' hoặc 'PRODUCT'."
        )
      }

      // Kiểm tra koiFishId nếu type là KOIFISH
      if (orderDetail.type === "KOIFISH" && !orderDetail.koiFishId) {
        throw responseStatus.responseBadRequest400("Thiếu koiFishId cho sản phẩm loại KOIFISH.")
      }

      // Kiểm tra productId nếu type là PRODUCT
      if (orderDetail.type === "PRODUCT" && !orderDetail.productId) {
        throw responseStatus.responseBadRequest400("Thiếu productId cho sản phẩm loại PRODUCT.")
      }
    })

    newOrder.orderDetails.map((orderDetail) => {
      const newOrderDetail: CreateOrderDetail = {
        koiFishId: orderDetail.koiFishId,
        productId: orderDetail.productId,
        type: orderDetail.type,
        quantity: orderDetail.quantity
      }
      orderDetailService.createOrderDetail(createdOrder.id!, newOrderDetail)
    })

    createdOrder.totalAmount = await calculateTotalAmountForOrder(createdOrder.id)

    return createdOrder
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function updateOrder(id: string, updatedOrder: UpdateOrder) {
  try {
    const order = await Order.findOne({ where: { id, isDeleted: false } })
    if (!order) {
      throw responseStatus.responseNotFound404("Không tìm thấy đơn hàng")
    }

    order.phoneNumber = updatedOrder.phoneNumber || order.phoneNumber
    order.status = updatedOrder.status || order.status
    order.totalAmount = updatedOrder.totalAmount || order.totalAmount

    await order.save()
    return "Cập nhật đơn hàng thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function deleteOrder(id: string) {
  try {
    const order = await Order.findOne({ where: { id, isDeleted: false } })
    if (!order) {
      throw responseStatus.responseNotFound404("Không tìm thấy đơn hàng")
    }

    order.isDeleted = true
    await order.save()

    return "Xóa đơn hàng thành công"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function calculateTotalAmountForOrder(orderId: string) {
  try {
    const orderDetails = await OrderDetail.findAll({
      where: { orderId },
      attributes: ["totalPrice"]
    })

    const totalAmount = orderDetails.reduce((sum, detail) => {
      return sum + (detail.getDataValue("totalPrice") || 0) // Cộng dồn totalPrice
    }, 0)

    return totalAmount
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

export default {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  calculateTotalAmountForOrder
}
