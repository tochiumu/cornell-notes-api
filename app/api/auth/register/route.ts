import { NextResponse } from "next/server"
import { prisma } from "@/libs/prisma"
import { hashPassword, signToken } from "@/libs/auth"
import { badRequest, serverError, isPrismaError } from "@/libs/apiResponse"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const email = body.email?.trim()?.toLowerCase()
    const password = body.password
    const name = body.name?.trim() || null

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return badRequest("有効なメールアドレスを入力してください")
    }
    if (!password || password.length < 6) {
      return badRequest("パスワードは6文字以上で入力してください")
    }

    const hashed = await hashPassword(password)

    const user = await prisma.user.create({
      data: { email, password: hashed, name },
      select: { id: true, email: true, name: true },
    })

    const token = await signToken(user.id)

    return NextResponse.json({ user, token }, { status: 201 })
  } catch (error) {
    if (isPrismaError(error, "P2002")) {
      return badRequest("このメールアドレスは既に登録されています")
    }
    return serverError(error)
  }
}
