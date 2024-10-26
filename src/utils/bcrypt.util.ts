import bcrypt from "bcrypt"

export async function hashPassword(password: string) {
  const saltRounds = await bcrypt.genSalt(10)
  return bcrypt.hash(password, saltRounds)
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}
