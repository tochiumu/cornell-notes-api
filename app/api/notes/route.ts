import { NextRequest, NextResponse } from "next/server"
import { getNotes, createNote } from "@/libs/repositories/noteRepository"
import { badRequest, serverError } from "@/libs/apiResponse"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl

    const q = searchParams.get("q") ?? undefined
    const tag = searchParams.get("tag") ?? undefined
    const sort = searchParams.get("sort") as "createdAt" | "updatedAt" | undefined
    const order = searchParams.get("order") as "asc" | "desc" | undefined

    const notes = await getNotes({ q, tag, sort, order })
    return NextResponse.json(notes)
  } catch (error) {
    return serverError(error)
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
      return badRequest("title is required")
    }
    const note = await createNote({
      title: body.title.trim(),
      ...(body.cue ? { cue: body.cue.trim() } : {}),
      note: body.note?.trim() ?? "",
      ...(body.summary ? { summary: body.summary.trim() } : {}),
      ...(body.color ? { color: body.color } : {}),
      ...(body.tags ? { tagsData: body.tags } : {}),
      ...(body.drawings ? { drawings: body.drawings } : {}),
    })
    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    return serverError(error)
  }
}
