import responseStatus from "~/constants/responseStatus"

export function validatePhoneNumber(phoneNumber: string): boolean {
  // Biểu thức chính quy kiểm tra số điện thoại Việt Nam (đơn giản)
  const phoneRegex = /^(0|\+84)(\d{9,10})$/

  if (!phoneRegex.test(phoneNumber)) {
    return false // Trả về false nếu không hợp lệ
  } else {
    return true // Trả về true nếu hợp lệ
  }
}
