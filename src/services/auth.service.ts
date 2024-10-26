import bcrypt from "bcrypt"
import { Response } from "express"
import jwt, { Secret, sign, VerifyErrors } from "jsonwebtoken"
import { Op } from "sequelize"

import responseStatus from "~/constants/responseStatus"
import { Account, CreateUser, JWTResponse, Role } from "~/constants/type"
import { User, UserInstance } from "~/models/user.model"
import { UserDetail } from "~/models/userDetail.model"
import { comparePassword, hashPassword } from "~/utils/bcrypt.util"
import { decrypt, encrypt } from "~/utils/crypto.util"
import { getUserFromToken } from "~/utils/getUserFromToken.util"
import { logNonCustomError } from "~/utils/logNonCustomError.util"
import { sendEmail } from "~/utils/sendEmail.util"

const expiresIn = "1h"
const refreshTokens: string[] = []

async function register(dataRequest: CreateUser) {
  try {
    if (!isValidUsername(dataRequest.username)) {
      throw responseStatus.responseBadRequest400("Invalid username: Only allow letters, numbers, and underscores")
    } // Kiểm tra regex tên người dùng

    if (!isValidPassword(dataRequest.password)) {
      throw responseStatus.responseBadRequest400(
        "Invalid password: Must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character"
      )
    } // Kiểm tra regex mật khẩu

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username: dataRequest.username }, { email: dataRequest.email }]
      }
    }) // Kiểm tra tên người dùng hoặc email đã tồn tại chưa
    if (existingUser) {
      throw responseStatus.responseConflict409("Username or email already exists")
    }

    const hashedPassword = await hashPassword(dataRequest.password) // Mã hóa mật khẩu

    const data = {
      email: dataRequest.email,
      username: dataRequest.username,
      password: hashedPassword,
      role: dataRequest.role as Role,
      dob: dataRequest.dob,
      gender: dataRequest.gender,
      iat: Date.now() // Thêm trường iat để xác định thời gian tạo
    }

    const encryptedData = encrypt(data) // Mã hóa dữ liệu

    const confirmLink = `${process.env.SERVER_URL}/api/auth/confirm-register?code=${encryptedData}` // Tạo liên kết xác nhận tài khoản
    const emailHeader = "Confirm register account at Koine"
    const emailBody = `
      <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 2px solid #007bff; border-radius: 8px; background-color: #fff; font-family: 'Arial', sans-serif;">
          <h2 style="color: #007bff;">Koine - Nền tảng giáo dục giới tính cho trẻ em</h2>
          <p style="margin-bottom: 20px;">Click this link to register your account at Koine:</p>
      <a href="${confirmLink}" style="display: inline-block; padding: 10px 20px; text-decoration: none; background-color: #007bff; color: #fff; border-radius: 5px;" target="_blank">Link active your account</a>
      </div>
      `
    await sendEmail(data.email, emailHeader, emailBody)

    return "Please check your email to confirm registration"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
} // Register new account

async function confirmRegister(code: string) {
  try {
    const data = decrypt(code) // Giải mã dữ liệu

    if (Date.now() - data.iat > 5 * 60 * 1000) {
      // 5 phút
      return responseStatus.responseUnauthorized401("Link has expired")
    } // Kiểm tra thời gian hết hạn

    const user = await User.create({
      email: data.email,
      username: data.username,
      password: data.password,
      role: data.role
    })

    if (!user.id) {
      throw responseStatus.responseInternalError500("Failed to create user")
    }

    // Tạo chi tiết người dùng
    await UserDetail.create({
      userId: user.id,
      phone: null,
      firstName: "",
      lastName: "",
      dob: data.dob,
      gender: data.gender,
      avatarUrl: `https://avatar.iran.liara.run/public/boy?username=${user.username}`
    })
    return
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
} // Confirm register adult account

async function login(loginKey: string, password: string, res: Response) {
  try {
    const searchCondition = loginKey.includes("@")
      ? { email: loginKey } // Nếu có '@', tìm theo email
      : { username: loginKey }
    const user = await User.findOne({
      where: searchCondition
    })
    if (!user) {
      throw responseStatus.responseNotFound404("User not found")
    }

    // So sánh mật khẩu đã nhập với mật khẩu đã hash trong cơ sở dữ liệu
    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      throw responseStatus.responseUnauthorized401(
        "Authentication failed. Please check your credentials and try again."
      )
    }

    if (user && isPasswordValid) {
      const accessToken = generateAccessToken(user)
      const refreshToken = generateRefreshToken(user)
      refreshTokens.push(refreshToken)
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict"
      })
      const jwtResponse: JWTResponse = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresAt: new Date(new Date().setHours(new Date().getHours() + parseInt(expiresIn.substring(0, 1)))),
        account: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role
        } as unknown as Account
      }
      return jwtResponse
    }
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
} // Login user

async function logout(refreshToken: string, res: Response) {
  res.clearCookie("refreshToken")
  refreshTokens.filter((token) => token !== refreshToken)
  return
} // Logout user

async function forgotPassword(email: string) {
  try {
    const user = await User.findOne({
      where: { email }
    })
    if (!user) {
      throw responseStatus.responseNotFound404("User not found")
    }
    const randomString = Math.random().toString(36).substring(2, 12)
    const hashedPassword = await bcrypt.hash(randomString, 10)
    const expiry = new Date(Date.now() + 15 * 60 * 1000) // Token hết hạn sau 15 phút

    const data = {
      id: user.id,
      expiry: expiry
    }
    const token = encrypt(data)

    user.password = hashedPassword
    await user.save()

    const resetLink = `${process.env.SERVER_URL}/api/auth/reset-password?code=${token}`
    const emailHeader = "Reset Your Password at Koine"
    const emailBody = `
      <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 2px solid #007bff; border-radius: 8px; background-color: #fff; font-family: 'Arial', sans-serif;">
          <h2 style="color: #007bff;">Koine - Nền tảng giáo dục giới tính cho trẻ em</h2>
          <p style="margin-bottom: 20px;">Your password has been reset. Your new password is: <strong>${randomString}</strong></p>
          <p style="margin-bottom: 20px;">We received a request to reset your password. Click the link below to reset password:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; text-decoration: none; background-color: #007bff; color: #fff; border-radius: 5px;" target="_blank">Reset Your Password</a>
          <p style="margin-top: 20px;">If you did not request a password reset, please ignore this email.</p>
      </div>
      `
    await sendEmail(email, emailHeader, emailBody)
    return
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
} // Forgot password

async function resetPassword(code: string, oldPassword: string, newPassword: string) {
  try {
    const data = decrypt(code)

    if (data.expiry < Date.now()) {
      // 15 phút
      throw responseStatus.responseUnauthorized401("Link has expired")
    } // Kiểm tra thời gian hết hạn

    const user = await User.findOne({
      where: { id: data.id }
    })
    if (!user) {
      throw responseStatus.responseNotFound404("User not found")
    }
    if (!comparePassword(oldPassword, user.password)) {
      throw responseStatus.responseUnauthorized401("Old password is incorrect")
    }
    const hashedPassword = await hashPassword(newPassword)
    user.password = hashedPassword
    await user.save()
    return
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
} // Reset password

async function changePassword(token: string, currentPassword: string, newPassword: string, confirmPassword: string) {
  try {
    const user = await getUserFromToken(token)
    const isPasswordCorrect = await comparePassword(currentPassword, user.password)
    if (!isPasswordCorrect) {
      throw responseStatus.responseUnauthorized401("Current password is incorrect")
    } // Kiểm tra mật khẩu hiện tại

    if (newPassword !== confirmPassword) {
      throw responseStatus.responseBadRequest400("Passwords do not match")
    }
    if (!isValidPassword(newPassword)) {
      throw responseStatus.responseBadRequest400(
        "Invalid password: Must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character"
      )
    } // Kiểm tra regex mật khẩu mới

    user.password = await hashPassword(newPassword)
    await user.save()

    return "Change password successfully!"
  } catch (error) {
    logNonCustomError(error)
    throw error
  }
} // Change password user

async function getRefreshToken(refreshToken: string, res: Response) {
  if (!refreshTokens.includes(refreshToken)) {
    throw responseStatus.responseUnauthorized401("Invalid token")
  }

  jwt.verify(refreshToken, process.env.SECRET as Secret, (err: VerifyErrors | null, user: any) => {
    if (err) {
      throw responseStatus.responseUnauthorized401("Invalid token")
    }
    refreshTokens.filter((token) => token !== refreshToken)
    const newAccessToken = generateAccessToken(user)
    const newRefreshToken = generateRefreshToken(user)
    refreshTokens.push(newRefreshToken)
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict"
    })

    const jwtResponse: JWTResponse = {
      accessToken: newAccessToken,
      refreshToken: refreshToken,
      expiresAt: new Date(new Date().setHours(new Date().getHours() + parseInt(expiresIn.substring(0, 1)))),
      account: {
        id: "",
        email: "",
        username: "",
        role: user.role
      } as Account
    }
    return jwtResponse
  })
} // Get refresh token

const generateAccessToken = (user: UserInstance) => {
  return sign(
    {
      id: user.id,
      username: user.username,
      role: user.role
    },
    process.env.SECRET as string,
    {
      expiresIn: expiresIn
    }
  )
} // Generate access token

const generateRefreshToken = (user: UserInstance) => {
  return sign(
    {
      id: user.id,
      username: user.username,
      role: user.role
    },
    process.env.SECRET as Secret,
    {
      expiresIn: "30d"
    }
  )
} // Generate refresh token

function isValidUsername(username: string): boolean {
  // Chỉ cho phép các ký tự chữ cái (a-z, A-Z), số (0-9), và dấu gạch dưới (_)
  const regex = /^[a-zA-Z0-9_]+$/

  return regex.test(username)
} // Check valid username, contains only letters, numbers, and underscores

function isValidPassword(password: string): boolean {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
} // Check valid password, contains at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character

export default {
  register,
  confirmRegister,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  getRefreshToken,
  logout
}
