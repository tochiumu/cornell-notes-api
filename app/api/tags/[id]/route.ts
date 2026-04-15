import { NextResponse } from "next/server"
import { deleteTag } from "@/libs/repositories/tagRepository"
import { notFound, serverError, isPrismaError } from "@/libs/apiResponse"

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await deleteTag(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    if (isPrismaError(error, "P2025")) {
      return notFound("Tag")
    }
    return serverError(error)
  }
}
