import type { Difficulty, Status } from "@/types"

export const statuses: Status[] = ["TODO", "IN_PROGRESS", "PR_SENT"]

export const statusLabels: Record<Status, string> = {
  TODO: "À faire",
  IN_PROGRESS: "En cours",
  PR_SENT: "PR envoyée",
}

export const difficultyStyles: Record<Difficulty, string> = {
  facile: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  moyen: "border border-amber-200 bg-amber-50 text-amber-700",
  difficile: "border border-rose-200 bg-rose-50 text-rose-700",
}
