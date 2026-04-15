import { prisma } from "../prisma"
import type { InputJsonValue } from "@prisma/client/runtime/client.js"

export type NoteSearchParams = {
  q?: string
  tag?: string
  sort?: "createdAt" | "updatedAt"
  order?: "asc" | "desc"
  userId?: string
}

export async function getNotes(params?: NoteSearchParams) {
  const conditions: Record<string, unknown>[] = []

  if (params?.userId) {
    conditions.push({ userId: params.userId })
  }

  if (params?.q) {
    conditions.push({
      OR: [
        { title: { contains: params.q, mode: "insensitive" as const } },
        { note: { contains: params.q, mode: "insensitive" as const } },
        { summary: { contains: params.q, mode: "insensitive" as const } },
        {
          cues: {
            some: {
              question: { contains: params.q, mode: "insensitive" as const },
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

  return prisma.note.findMany({
    where: conditions.length > 0 ? { AND: conditions } : undefined,
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
  tagsData?: InputJsonValue
  drawings?: InputJsonValue
  userId?: string
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
    tagsData?: InputJsonValue
    drawings?: InputJsonValue
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
