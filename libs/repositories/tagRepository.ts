import { prisma } from "../prisma"

export async function getTags() {
  return prisma.tag.findMany({
    select: {
      id: true,
      name: true,
      _count: { select: { notes: true } },
    },
    orderBy: { name: "asc" },
  })
}

export async function createTag(name: string) {
  return prisma.tag.create({
    data: { name },
  })
}

export async function deleteTag(id: string) {
  return prisma.tag.delete({
    where: { id },
  })
}

export async function addTagToNote(noteId: string, tagId: string) {
  return prisma.noteTag.create({
    data: { noteId, tagId },
  })
}

export async function removeTagFromNote(noteId: string, tagId: string) {
  return prisma.noteTag.delete({
    where: { noteId_tagId: { noteId, tagId } },
  })
}
