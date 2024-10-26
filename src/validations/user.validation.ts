import { NextFunction, Request, Response } from "express"
import { z } from "zod"

import responseStatus from "~/constants/responseStatus"

const customerSchema = z.object({
  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be numeric and have 10 characters")
    .startsWith("0")
    .optional(),
  firstName: z.string().min(1, "First name must have at least one character").optional(),
  lastName: z.string().min(1, "Last name must have at least one character").optional(),
  dob: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "UNKNOWN"]).optional(),
  avatarUrl: z.string().url("Avatar Url must be a valid Url").optional()
}) // Define the customer schema using Zod

function validateUser(req: Request, res: Response, next: NextFunction) {
  try {
    customerSchema.parse(req.body)
    next()
  } catch (error) {
    res.json(responseStatus.invalidFieldResquest("Invalid customer data provided", error))
  }
} // Generic validation function (refer to previous explanation)

export default { validateUser }
