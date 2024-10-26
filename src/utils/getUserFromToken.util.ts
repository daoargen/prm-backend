import jwt, { Secret } from "jsonwebtoken"

import responseStatus from "~/constants/responseStatus"
import { User, UserInstance } from "~/models/user.model"

export async function getUserFromToken(token: string): Promise<UserInstance> {
  const decoded = jwt.verify(token, process.env.SECRET as Secret) as jwt.JwtPayload
  if (!decoded) {
    throw responseStatus.responseUnauthorized401("Invalid token")
  }
  const user = await User.findOne({ where: { id: decoded.id } })
  if (!user) throw responseStatus.responseNotFound404("User not found")
  return user
}
