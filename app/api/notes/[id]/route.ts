import { NextResponse } from "next/server"
import {
  getNoteById,
  updateNote,
  deleteNote,
} from "@/libs/repositories/noteRepository"
import { getUserFromRequest, unauthorized } from "@/libs/auth"
import { notFound, serverError, isPrismaError } from "@/libs/apiResponse"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return unauthorized()

    const { id } = await params
    const note = await getNoteById(id)

    if (!note || (note.userId && note.userId !== user.id)) {
      return notFound("Note")
    }

    return NextResponse.json(note)
  } catch (error) {
    return serverError(error)
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return unauthorized()

    const { id } = await params

    const existing = await getNoteById(id)
    if (!existing || (existing.userId && existing.userId !== user.id)) {
      return notFound("Note")
    }

    const body = await req.json()

    const data: Record<string, unknown> = {}
    if (body.title !== undefined) data.title = body.title
    if (body.cue !== undefined) data.cue = body.cue
    if (body.note !== undefined) data.note = body.note
    if (body.summary !== undefined) data.summary = body.summary
    if (body.color !== undefined) data.color = body.color
    if (body.tags !== undefined) data.tagsData = body.tags
    if (body.drawings !== undefined) data.drawings = body.drawings

    const note = await updateNote(id, data as Parameters<typeof updateNote>[1])
    return NextResponse.json(note)
  } catch (error) {
    if (isPrismaError(error, "P2025")) {
      return notFound("Note")
    }
    return serverError(error)
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return unauthorized()

    const { id } = await params

    const existing = await getNoteById(id)
    if (!existing || (existing.userId && existing.userId !== user.id)) {
      return notFound("Note")
    }

    await deleteNote(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    if (isPrismaError(error, "P2025")) {
      return notFound("Note")
    }
    return serverError(error)
  }
}
