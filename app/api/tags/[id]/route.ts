import { NextResponse } from "next/server"
import { deleteTag } from "@/libs/repositories/tagRepository"
import { notFound, serverError } from "@/libs/apiResponse"
import { Prisma } from "@prisma/client"

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await deleteTag(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return notFound("Tag")
    }
    return serverError(error)
  }
}
