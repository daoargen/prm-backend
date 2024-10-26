import { Request, Response } from "express"

import responseStatus from "~/constants/responseStatus"
import userService from "~/services/user.service"

async function getUsers(req: Request, res: Response) {
  try {
    const { users, pagination } = await userService.getAllUsers(req)
    return res.json(responseStatus.responseData200("Get users list successfully!", users, pagination))
  } catch (error) {
    return res.json(error)
  }
} // Controller for get all users

async function getUser(req: Request, res: Response) {
  try {
    const id = req.params.id
    const user = await userService.getUserById(id)
    return res.json(responseStatus.responseData200("Get user successfully!", user))
  } catch (error) {
    return res.json(error)
  }
} // Controller for get user by id

async function editUser(req: Request, res: Response) {
  try {
    const id = req.params.id
    const newUser = req.body
    await userService.editUser(id, newUser)
    return res.json(responseStatus.responseMessage200("Edit user successfully!"))
  } catch (error) {
    return res.json(error)
  }
} // Controller for edit user

async function deleteUser(req: Request, res: Response) {
  try {
    const id = req.params.id
    await userService.deleteUser(id)
    return res.json(responseStatus.responseMessage200("Delete user successfully!"))
  } catch (error) {
    return res.json(error)
  }
} // Controller for delete user

export default {
  getUsers,
  getUser,
  editUser,
  deleteUser
}
