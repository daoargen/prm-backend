import { Op } from "sequelize"

import responseStatus from "~/constants/responseStatus"
import { createPayment, handleSepayWebhook, UpdatePayment } from "~/constants/type"
import { KoiFish } from "~/models/koiFish.model"
import { Order } from "~/models/order.model"
import { OrderDetail } from "~/models/orderDetail.model"
import { Payment, PaymentAttributes } from "~/models/payment.model"
import { Product } from "~/models/product.model"
import { logNonCustomError } from "~/utils/logNonCustomError.util"

import orderService from "./order.service"

async function getPaymentById(id: string) {
  try {
    const payment = await Payment.findOne({
      where: { id, isDeleted: false }
    })

    if (!payment) {
      throw responseStatus.responseNotFound404("Không tìm thấy thông tin thanh toán.")
    }

    return payment
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function createPayment(newPayment: createPayment) {
  try {
    const createdPayment = await Payment.create({
      orderId: newPayment.orderId,
      amount: newPayment.amount,
      paymentCode: await generateNextPaymentCode(),
      payDate: new Date(),
      payMethod: newPayment.payMethod,
      payStatus: "PENDING"
    })
    return createdPayment
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function updatePayment(id: string, updatedPayment: UpdatePayment) {
  try {
    const payment = await Payment.findOne({ where: { id, isDeleted: false } })
    if (!payment) {
      throw responseStatus.responseNotFound404("Không tìm thấy thông tin thanh toán.")
    }

    // Update các trường
    payment.payMethod = updatedPayment.payMethod || payment.payMethod
    payment.payStatus = updatedPayment.payStatus || payment.payStatus

    await payment.save()

    return "Cập nhật thông tin thanh toán thành công!"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function generateNextPaymentCode() {
  try {
    // Tìm paymentCode lớn nhất trong database
    const lastPayment = await Payment.findOne({
      where: {
        paymentCode: {
          [Op.regexp]: "^DH\\d{4}$" // Chỉ lấy paymentCode có dạng DHxxxx (x là số)
        }
      },
      order: [["paymentCode", "DESC"]] // Sắp xếp theo paymentCode giảm dần
    })

    if (lastPayment) {
      // Nếu tìm thấy paymentCode lớn nhất
      const lastCode = lastPayment.paymentCode
      const numberPart = parseInt(lastCode.slice(2), 10) // Lấy phần số (bỏ 2 ký tự đầu "DH")
      const nextNumber = numberPart + 1
      const nextCode = `DH${nextNumber.toString().padStart(4, "0")}` // Tạo paymentCode mới
      return nextCode
    } else {
      // Nếu không tìm thấy paymentCode nào (database trống)
      return "DH0001" // Bắt đầu từ DH0001
    }
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}
async function completePaymentFromWebhook(webhookData: handleSepayWebhook) {
  try {
    const payment = await Payment.findOne({
      where: {
        paymentCode: webhookData.content, // Tìm theo paymentCode
        amount: webhookData.transferAmount, // Kiểm tra amount
        isDeleted: false
      }
    })

    if (!payment) {
      throw responseStatus.responseNotFound404("Payment not found")
    }

    const order = await Order.findOne({
      where: { id: payment.orderId, isDeleted: false }
    })

    if (!order) {
      throw responseStatus.responseNotFound404("Order not found")
    }

    if (payment.payStatus === "COMPLETED") {
      throw responseStatus.responseBadRequest400("Payment already completed")
    }

    payment.payStatus = "COMPLETED"
    await payment.save()

    if (payment.payMethod === "CARD") {
      order.status = "TRANSIT"
      await order.save()
    }

    order.status = "COMPLETED"
    await order.save()

    const orderDetails = await OrderDetail.findAll({
      where: { orderId: order.id, isDeleted: false },
      attributes: ["id", "orderId", "koiFishId", "productId", "type", "quantity", "unitPrice", "totalPrice"]
    })
    const productIds = orderDetails
      .map((orderDetail) => orderDetail.productId)
      .filter((productId): productId is string => productId !== undefined)
    const products = await Product.findAll({
      where: { id: productIds, isDeleted: false },
      attributes: ["id", "name", "description", "stock", "price"]
    })

    const koiFishIds = orderDetails
      .map((orderDetail) => orderDetail.koiFishId)
      .filter((koiFishId): koiFishId is string => koiFishId !== undefined)
    const koiFishs = await KoiFish.findAll({
      where: { id: koiFishIds, isDeleted: false },
      attributes: ["id", "name", "description", "size", "gender", "isSold", "price"]
    })

    const updatedProducts = products.map((product) => {
      const orderDetail = orderDetails.find((od) => od.productId === product.id && od.type === "PRODUCT")

      if (orderDetail) {
        product.stock -= orderDetail.quantity
      }

      return product
    })

    await Promise.all(
      updatedProducts.map((product) => {
        return product.save()
      })
    )

    const updatedKoiFishs = koiFishs.map((koiFish) => {
      koiFish.isSold = true
      return koiFish
    })

    await Promise.all(
      updatedKoiFishs.map((koiFish) => {
        return koiFish.save()
      })
    )
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
}

async function cancelPayment(paymentId: string) {
  try {
    const payment = await Payment.findOne({
      where: { id: paymentId, isDeleted: false }
    })

    if (!payment) {
      throw responseStatus.responseNotFound404("Payment not found")
    }

    const order = await Order.findOne({
      where: { id: payment.orderId, isDeleted: false }
    })

    if (!order) {
      throw responseStatus.responseNotFound404("Order not found")
    }

    if (payment.payStatus === "CANCEL") {
      throw responseStatus.responseBadRequest400("Payment already cancelled")
    }

    if (order.status === "CANCEL") {
      throw responseStatus.responseBadRequest400("Order already cancelled")
    }

    if (order.status === "TRANSIT") {
      throw responseStatus.responseBadRequest400("Order is being in transit")
    }

    payment.payStatus = "CANCEL"
    await payment.save()

    order.status = "CANCEL"
    await order.save()
  } catch (error) {
    console.error(error)
    throw error
  }
}

export default {
  getPaymentById,
  createPayment,
  updatePayment,
  generateNextPaymentCode,
  completePaymentFromWebhook,
  cancelPayment
}
