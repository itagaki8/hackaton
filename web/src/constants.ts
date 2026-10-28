import type { Difficulty, Status } from "@/types"

export const statuses: Status[] = ["TODO", "IN_PROGRESS", "PR_SENT"]

export const statusLabels: Record<Status, string> = {
  TODO: "À faire",
  IN_PROGRESS: "En cours",
  PR_SENT: "PR envoyée",
}

export const difficultyStyles: Record<Difficulty, string> = {
  facile: "bg-green-100 text-green-800",
  moyen: "bg-amber-100 text-amber-800",
  difficile: "bg-red-100 text-red-800",
}