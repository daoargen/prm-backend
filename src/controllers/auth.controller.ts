import { Request, Response } from "express"

import responseStatus from "~/constants/responseStatus"
import { CreateUser, Role } from "~/constants/type"
import authService from "~/services/auth.service"

async function register(req: Request, res: Response) {
  try {
    const { email, username, password, gender, dob, role } = req.body
    if (!email || !username || !password || !gender || !dob) {
      return res.json(responseStatus.responseNotFound404("Missing required fields"))
    }
    const userRole = role || "USER"
    const dataRequest: CreateUser = {
      email,
      username,
      password,
      gender,
      dob,
      role: userRole
    }

    const dataResponse = await authService.register(dataRequest)
    return res.json(responseStatus.responseMessage200(dataResponse))
  } catch (error) {
    return res.json(error)
  }
} // Controller for registering new account

async function confirmRegister(req: Request, res: Response) {
  try {
    const code = req.query.code as string
    if (!code) {
      return res.json(responseStatus.responseBadRequest400("Missing confirmation code"))
    }

    await authService.confirmRegister(code)
    return res.status(200).redirect(`${process.env.SERVER_URL}/api/auth/login`)
  } catch (error) {
    return res.json(error)
  }
} // Controller for confirming registration

async function login(req: Request, res: Response) {
  try {
    const { loginKey, password } = req.body
    if (!loginKey || !password) {
      return res.json(responseStatus.responseNotFound404("Missing required fields"))
    }

    const dataResponse = await authService.login(loginKey, password, res)
    return res.json(responseStatus.responseData200("Login successfully!", dataResponse))
  } catch (error) {
    return res.json(error)
  }
} // Controller for logging in

async function logout(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies.refreshToken
    await authService.logout(refreshToken, res)
    return res.json(responseStatus.responseMessage200("Logout successfully!"))
  } catch (error) {
    return res.json(error)
  }
} // Controller for logging out

async function forgotPassword(req: Request, res: Response) {
  try {
    const email = req.body.email
    if (!email) return res.json(responseStatus.responseNotFound404("Missing email"))

    authService.forgotPassword(email)
    return res.json(responseStatus.responseMessage200("Please check your email to reset password!"))
  } catch (error) {
    return res.json(error)
  }
} // Controller for forgot password

async function resetPassword(req: Request, res: Response) {
  try {
    const code = req.query.code as string
    const { oldPassword, newPassword } = req.body
    authService.resetPassword(code, oldPassword, newPassword)
    return res.json(responseStatus.responseMessage200("Reset password successfully!"))
  } catch (error) {
    return res.json(error)
  }
} // Controller for resetting password

async function changePassword(req: Request, res: Response) {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body
    const token = req.header("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return res.json(responseStatus.responseUnauthorized401())
    }
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.json(responseStatus.responseNotFound404("Missing required fields"))
    }
    const dataResponse = await authService.changePassword(token, currentPassword, newPassword, confirmPassword)
    return res.json(responseStatus.responseMessage200(dataResponse))
  } catch (error) {
    return res.json(error)
  }
} // Controller for changing password

async function getRefreshToken(req: Request, res: Response) {
  try {
    const refreshToken = req.body.refreshToken
    if (!refreshToken) return res.json(responseStatus.responseUnauthorized401())

    const dataResponse = await authService.getRefreshToken(refreshToken, res)
    return res.json(responseStatus.responseData200("Get refresh token successfully!", dataResponse))
  } catch (error) {
    return res.json(error)
  }
} // Controller for getting refresh token

export default {
  register,
  confirmRegister,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  getRefreshToken
}
