import { NextResponse } from "next/server"
import { updateCue, deleteCue } from "@/libs/repositories/cueRepository"
import { notFound, serverError } from "@/libs/apiResponse"
import { Prisma } from "@prisma/client"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    const cue = await updateCue(id, body)
    return NextResponse.json(cue)
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return notFound("Cue")
    }
    return serverError(error)
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await deleteCue(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return notFound("Cue")
    }
    return serverError(error)
  }
}
