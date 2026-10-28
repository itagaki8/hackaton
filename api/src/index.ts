import "dotenv/config" // doit rester la PREMIÈRE ligne 
import express from "express"
import cors from "cors"
import { z } from "zod"
import { fetchIssue, normalizeIssueUrl } from "./github"
import { analyzeIssue } from "./gemma"
import { statusSchema } from "./schemas"
import { create, findByUrl, list, remove, setStatus } from "./issues"

const app = express()
app.use(cors())
app.use(express.json())

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" })
})

// Analyser une issue (ou la reprendre de la base si on l'a déjà analysée)
const bodySchema = z.object({ issueUrl: z.string().url() })

app.post("/api/analyze", async (req, res) => {
  const parsed = bodySchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: "issueUrl invalide" })
  }

  const key = normalizeIssueUrl(parsed.data.issueUrl)
  if (!key) {
    return res.status(400).json({ error: "URL d'issue GitHub invalide" })
  }

  try {
    const existing = await findByUrl(key)
    if (existing) {
      return res.json({ issue: existing, cached: true })
    }

    const issue = await fetchIssue(parsed.data.issueUrl)
    const analysis = await analyzeIssue(issue)
    const saved = await create(key, issue, analysis)
    res.status(201).json({ issue: saved, cached: false })
  } catch (error) {
    console.error(error)
    const message = error instanceof Error ? error.message : "Erreur inconnue"
    res.status(500).json({ error: message })
  }
})

// Lister toutes les issues enregistrées
app.get("/api/issues", async (_req, res) => {
  res.json(await list())
})

// Changer le statut d'une issue
const idSchema = z.coerce.number().int().positive()
const statusBodySchema = z.object({ status: statusSchema })

app.patch("/api/issues/:id/status", async (req, res) => {
  const id = idSchema.safeParse(req.params.id)
  const body = statusBodySchema.safeParse(req.body)
  if (!id.success || !body.success) {
    return res.status(400).json({ error: "Requête invalide" })
  }

  try {
    res.json(await setStatus(id.data, body.data.status))
  } catch {
    res.status(404).json({ error: "Issue introuvable" })
  }
})

// Supprimer une issue
app.delete("/api/issues/:id", async (req, res) => {
  const id = idSchema.safeParse(req.params.id)
  if (!id.success) {
    return res.status(400).json({ error: "Identifiant invalide" })
  }

  try {
    await remove(id.data)
    res.status(204).send()
  } catch {
    res.status(404).json({ error: "Issue introuvable" })
  }
})

const port = Number(process.env.PORT ?? 3001)
app.listen(port, () => {
  console.log(`API prête sur http://localhost:${port}`)
})