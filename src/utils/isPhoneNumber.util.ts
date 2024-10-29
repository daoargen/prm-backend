import responseStatus from "~/constants/responseStatus"

export function validatePhoneNumber(phoneNumber: string): void {
  // Biểu thức chính quy kiểm tra số điện thoại Việt Nam (đơn giản)
  const phoneRegex = /^(0|\+84)(\d{9,10})$/

  if (!phoneRegex.test(phoneNumber)) {
    throw responseStatus.responseBadRequest400("Số điện thoại không hợp lệ.")
  }
}
