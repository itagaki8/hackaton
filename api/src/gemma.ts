import { GoogleGenAI } from "@google/genai"
import { analysisSchema, type Analysis } from "./schemas"
import type { GithubIssue } from "./github"

function buildPrompt(issue: GithubIssue): string {
  return `Tu es un mentor open source bienveillant. Tu aides un développeur débutant
à faire sa première contribution Hacktoberfest. Réponds en français.

Analyse cette issue GitHub et réponds UNIQUEMENT avec un objet JSON valide,
sans texte autour et sans balises markdown, avec exactement ces clés :
- "summary": string (résumé simple de ce qu'on demande)
- "difficulty": "facile" | "moyen" | "difficile"
- "skills": string[] (compétences nécessaires)
- "steps": string[] (plan de contribution en étapes concrètes)
- "filesToCheck": string[] (types de fichiers ou dossiers à regarder en premier)
- "prTitle": string (titre de Pull Request proposé)
- "prDescription": string (description de la PR en quelques lignes)

Dépôt : ${issue.repo}
Issue #${issue.number} : ${issue.title}
Labels : ${issue.labels.join(", ") || "aucun"}

Description :
${issue.body || "(vide)"}`
}

function parseJson(text: string): unknown {
  const cleaned = text.replace(/```json|```/g, "").trim()
  return JSON.parse(cleaned)
}

export async function analyzeIssue(issue: GithubIssue): Promise<Analysis> {
  const apiKey = process.env.GEMINI_API_KEY
  const model = process.env.AI_MODEL
  if (!apiKey || !model) {
    throw new Error("GEMINI_API_KEY ou AI_MODEL manquant dans .env")
  }

  const ai = new GoogleGenAI({ apiKey })
  const response = await ai.models.generateContent({
    model,
    contents: buildPrompt(issue),
  })

  return analysisSchema.parse(parseJson(response.text ?? ""))
}