import { User } from "../models/user.model.js"

export const generateUsername = async (role) => {

  const rolePrefix = {
    STUDENT: "stu",
    TEACHER: "tch",
    PARENT: "par",
    TRANSPORT_HANDLER: "hdl",
    // DRIVER: "dri"
  }

  const prefix = rolePrefix[role]

  if (!prefix) {
    throw new Error("Invalid role")
  }

  // find last user of same role
  const lastUser = await User.findOne({ role })
    .sort({ createdAt: -1 })

  let nextNumber = 1

  if (lastUser && lastUser.username) {

    const numberPart = lastUser.username.replace(prefix, "")

    const parsed = parseInt(numberPart)

    if (!isNaN(parsed)) {
      nextNumber = parsed + 1
    }

  }

  return `${prefix}${nextNumber}`
}