import { NextResponse } from "next/server"
import { addTagToNote } from "@/libs/repositories/tagRepository"
import { badRequest, conflict, serverError } from "@/libs/apiResponse"
import { Prisma } from "@prisma/client"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: noteId } = await params
    const body = await req.json()

    if (!body.tagId || typeof body.tagId !== "string") {
      return badRequest("tagId is required")
    }

    const noteTag = await addTagToNote(noteId, body.tagId)
    return NextResponse.json(noteTag, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return conflict("This tag is already assigned to the note")
      }
      if (error.code === "P2003") {
        return badRequest("Invalid noteId or tagId")
      }
    }
    return serverError(error)
  }
}
