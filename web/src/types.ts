export type Status = "TODO" | "IN_PROGRESS" | "PR_SENT"
export type Difficulty = "facile" | "moyen" | "difficile"

export type Analysis = {
  summary: string
  difficulty: Difficulty
  skills: string[]
  steps: string[]
  filesToCheck: string[]
  prTitle: string
  prDescription: string
}

export type Issue = {
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