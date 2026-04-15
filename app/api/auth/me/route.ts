import { NextResponse } from "next/server"
import { getUserFromRequest, unauthorized } from "@/libs/auth"
import { serverError } from "@/libs/apiResponse"

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return unauthorized()

    return NextResponse.json({ user })
  } catch (error) {
    return serverError(error)
  }
}
