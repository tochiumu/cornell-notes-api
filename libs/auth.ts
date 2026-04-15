import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "cornell-notes-dev-secret-change-me"
)
const TOKEN_EXPIRY = "30d"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function signToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET)
}

export async function verifyToken(
  token: string
): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    if (!payload.sub) return null
    return { userId: payload.sub }
  } catch {
    return null
  }
}

export async function getUserFromRequest(
  req: Request
): Promise<{ id: string; email: string; name: string | null } | null> {
  const header = req.headers.get("Authorization")
  if (!header?.startsWith("Bearer ")) return null

  const token = header.slice(7)
  const result = await verifyToken(token)
  if (!result) return null

  const user = await prisma.user.findUnique({
    where: { id: result.userId },
    select: { id: true, email: true, name: true },
  })
  return user
}

export function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 })
}
