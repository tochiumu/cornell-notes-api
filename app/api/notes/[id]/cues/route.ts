import { NextResponse } from "next/server"
import { getCuesByNoteId, createCue } from "@/libs/repositories/cueRepository"
import { badRequest, serverError, isPrismaError } from "@/libs/apiResponse"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: noteId } = await params
    const cues = await getCuesByNoteId(noteId)
    return NextResponse.json(cues)
  } catch (error) {
    return serverError(error)
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: noteId } = await params
    const body = await req.json()

    if (!body.question || typeof body.question !== "string" || !body.question.trim()) {
      return badRequest("question is required")
    }

    const cue = await createCue(noteId, body.question.trim())
    return NextResponse.json(cue, { status: 201 })
  } catch (error) {
    if (isPrismaError(error, "P2003")) {
      return badRequest("Invalid noteId")
    }
    return serverError(error)
  }
}
