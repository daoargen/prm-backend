import { format, toZonedTime } from "date-fns-tz"

import { FormattedModel } from "../constants/type"

export function formatModelDate<T extends FormattedModel>(model: T): T {
  const timeZone = "Asia/Ho_Chi_Minh"
  const formatString = "HH:mm:ss-dd/MM/yyyy"

  const formatDate = (dateString?: string): string => {
    if (!dateString) return ""

    const date = new Date(dateString)
    const zonedDate = toZonedTime(date, timeZone)
    return format(zonedDate, formatString, { timeZone })
  }

  const formattedModel: T = { ...model }

  if (formattedModel?.createdAt) {
    formattedModel.createdAt = formatDate(formattedModel.createdAt)
  }

  if (formattedModel?.updatedAt) {
    formattedModel.updatedAt = formatDate(formattedModel.updatedAt)
  }

  return formattedModel
}
