import { NextResponse } from "next/server"
import { prisma } from "@/libs/prisma"
import { comparePassword, signToken } from "@/libs/auth"
import { badRequest, serverError } from "@/libs/apiResponse"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const email = body.email?.trim()?.toLowerCase()
    const password = body.password

    if (!email || !password) {
      return badRequest("メールアドレスとパスワードを入力してください")
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !(await comparePassword(password, user.password))) {
      return NextResponse.json(
        { error: "メールアドレスまたはパスワードが正しくありません" },
        { status: 401 }
      )
    }

    const token = await signToken(user.id)

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    })
  } catch (error) {
    return serverError(error)
  }
}
