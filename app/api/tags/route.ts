import { NextResponse } from "next/server"
import { getTags, createTag } from "@/libs/repositories/tagRepository"
import { badRequest, conflict, serverError, isPrismaError } from "@/libs/apiResponse"

export async function GET() {
  try {
    const tags = await getTags()
    return NextResponse.json(tags)
  } catch (error) {
    return serverError(error)
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
      return badRequest("name is required")
    }

    const tag = await createTag(body.name.trim())
    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    if (isPrismaError(error, "P2002")) {
      return conflict("Tag with this name already exists")
    }
    return serverError(error)
  }
}
