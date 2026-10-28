import type { Issue } from "@prisma/client"
import { prisma } from "./db"
import { analysisSchema, statusSchema, type Analysis, type Status } from "./schemas"
import type { GithubIssue } from "./github"

export type IssueDto = {
  id: number
  url: string
  repo: string
  number: number
  title: string
  labels: string[]
  analysis: Analysis
  status: Status
  createdAt: string
}

// Transforme une ligne de la base en objet propre pour le client
function toDto(row: Issue): IssueDto {
  return {
    id: row.id,
    url: row.url,
    repo: row.repo,
    number: row.number,
    title: row.title,
    labels: JSON.parse(row.labels) as string[],
    analysis: analysisSchema.parse(JSON.parse(row.analysis)),
    status: statusSchema.parse(row.status),
    createdAt: row.createdAt.toISOString(),
  }
}

export async function findByUrl(url: string): Promise<IssueDto | null> {
  const row = await prisma.issue.findUnique({ where: { url } })
  return row ? toDto(row) : null
}

export async function create(
  url: string,
  issue: GithubIssue,
  analysis: Analysis,
): Promise<IssueDto> {
  const row = await prisma.issue.create({
    data: {
      url,
      repo: issue.repo,
      number: issue.number,
      title: issue.title,
      labels: JSON.stringify(issue.labels),
      analysis: JSON.stringify(analysis),
    },
  })
  return toDto(row)
}

export async function list(): Promise<IssueDto[]> {
  const rows = await prisma.issue.findMany({ orderBy: { createdAt: "desc" } })
  return rows.map(toDto)
}

export async function setStatus(id: number, status: Status): Promise<IssueDto> {
  const row = await prisma.issue.update({ where: { id }, data: { status } })
  return toDto(row)
}

export async function remove(id: number): Promise<void> {
  await prisma.issue.delete({ where: { id } })
}