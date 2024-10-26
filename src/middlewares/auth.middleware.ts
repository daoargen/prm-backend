import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload, Secret } from "jsonwebtoken"

import responseStatus from "~/constants/responseStatus"
import { Role } from "~/constants/type"

function verifyMinimumRole(minimumRole: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return res.json(responseStatus.responseUnauthorized401())
    }

    try {
      jwt.verify(token, process.env.SECRET as Secret, (err, decoded) => {
        if (err) {
          return res.json(responseStatus.responseBadRequest400("Invalid token"))
        }
        const decodedPayload = decoded as JwtPayload
        const userRole = Role[decodedPayload.role as keyof typeof Role]
        if (userRole === undefined || userRole < minimumRole) {
          return res.json(responseStatus.responseForbidden403())
        }

        next()
      })
    } catch (error) {
      console.log(error)
      return res.json(error)
    }
  }
}

function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")
    if (token) {
      jwt.verify(token, process.env.SECRET as Secret, (err, decoded) => {
        if (err) {
          return res.json(responseStatus.responseBadRequest400("Invalid token"))
        }
        next()
      })
    } else {
      return res.json(responseStatus.responseUnauthorized401())
    }
  } catch (error) {
    console.log(error)
    return res.json(error)
  }
}

function verifyOnlyRole(onlyRole: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return res.json(responseStatus.responseUnauthorized401())
    }

    try {
      jwt.verify(token, process.env.SECRET as Secret, (err, decoded) => {
        if (err) {
          return res.json(responseStatus.responseBadRequest400("Invalid token"))
        }
        const decodedPayload = decoded as JwtPayload
        const userRole = Role[decodedPayload.role as keyof typeof Role]
        if (userRole === undefined || userRole === onlyRole) {
          return res.json(responseStatus.responseForbidden403())
        }

        next()
      })
    } catch (error) {
      console.log(error)
      return res.json(error)
    }
  }
}

export default {
  verifyMinimumRole,
  verifyToken,
  verifyOnlyRole
}
