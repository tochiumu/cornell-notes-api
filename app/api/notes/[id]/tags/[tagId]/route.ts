import { NextResponse } from "next/server"
import { removeTagFromNote } from "@/libs/repositories/tagRepository"
import { notFound, serverError } from "@/libs/apiResponse"
import { Prisma } from "@prisma/client"

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; tagId: string }> }
) {
  try {
    const { id: noteId, tagId } = await params
    await removeTagFromNote(noteId, tagId)
    return NextResponse.json({ success: true })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return notFound("NoteTag")
    }
    return serverError(error)
  }
}
