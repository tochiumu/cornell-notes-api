import { Prisma } from "@prisma/client"
import { prisma } from "../prisma"

export type NoteSearchParams = {
  q?: string
  tag?: string
  sort?: "createdAt" | "updatedAt"
  order?: "asc" | "desc"
}

export async function getNotes(params?: NoteSearchParams) {
  const conditions: Prisma.NoteWhereInput[] = []

  if (params?.q) {
    conditions.push({
      OR: [
        { title: { contains: params.q, mode: "insensitive" } },
        { note: { contains: params.q, mode: "insensitive" } },
        { summary: { contains: params.q, mode: "insensitive" } },
        {
          cues: {
            some: {
              question: { contains: params.q, mode: "insensitive" },
            },
          },
        },
      ],
    })
  }

  if (params?.tag) {
    conditions.push({
      tags: { some: { tag: { name: params.tag } } },
    })
  }

  const where: Prisma.NoteWhereInput =
    conditions.length > 0 ? { AND: conditions } : {}

  return prisma.note.findMany({
    where,
    select: {
      id: true,
      title: true,
      summary: true,
      color: true,
      tagsData: true,
      createdAt: true,
      updatedAt: true,
      tags: {
        select: { tag: { select: { id: true, name: true } } },
      },
    },
    orderBy: {
      [params?.sort ?? "createdAt"]: params?.order ?? "desc",
    },
  })
}

export async function getNoteById(id: string) {
  return prisma.note.findUnique({
    where: { id },
    include: {
      cues: true,
      tags: {
        select: { tag: { select: { id: true, name: true } } },
      },
    },
  })
}

export async function createNote(data: {
  title: string
  cue?: string
  note: string
  summary?: string
  color?: string
  tagsData?: unknown
  drawings?: Record<string, unknown>
}) {
  return prisma.note.create({ data })
}

export async function updateNote(
  id: string,
  data: {
    title?: string
    cue?: string | null
    note?: string
    summary?: string
    color?: string
    tagsData?: unknown
    drawings?: Record<string, unknown> | null
  }
) {
  return prisma.note.update({
    where: { id },
    data,
  })
}

export async function deleteNote(id: string) {
  return prisma.note.delete({
    where: { id },
  })
}
