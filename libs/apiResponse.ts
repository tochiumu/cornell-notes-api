import { NextResponse } from "next/server"

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 })
}

export function notFound(resource: string) {
  return NextResponse.json({ error: `${resource} not found` }, { status: 404 })
}

export function conflict(message: string) {
  return NextResponse.json({ error: message }, { status: 409 })
}

export function serverError(error: unknown) {
  console.error(error)
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  )
}
