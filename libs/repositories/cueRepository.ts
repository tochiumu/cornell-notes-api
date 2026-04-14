import { prisma } from "../prisma"

export async function getCuesByNoteId(noteId: string) {
  return prisma.cue.findMany({
    where: { noteId },
    orderBy: { id: "asc" },
  })
}

export async function createCue(noteId: string, question: string) {
  return prisma.cue.create({
    data: { noteId, question },
  })
}

export async function updateCue(
  id: string,
  data: { question?: string; answer?: string }
) {
  return prisma.cue.update({
    where: { id },
    data,
  })
}

export async function deleteCue(id: string) {
  return prisma.cue.delete({
    where: { id },
  })
}
