import { z } from "zod"

export const analysisSchema = z.object({
  summary: z.string(),
  difficulty: z.enum(["facile", "moyen", "difficile"]),
  skills: z.array(z.string()),
  steps: z.array(z.string()),
  filesToCheck: z.array(z.string()),
  prTitle: z.string(),
  prDescription: z.string(),
})

export type Analysis = z.infer<typeof analysisSchema>
export const statusSchema = z.enum(["TODO", "IN_PROGRESS", "PR_SENT"])
export type Status = z.infer<typeof statusSchema>