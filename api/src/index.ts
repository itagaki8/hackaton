import "dotenv/config" // doit rester la PREMIÈRE ligne
import express from "express"
import cors from "cors"
import { z } from "zod"
import { fetchIssue } from "./github"
import { analyzeIssue } from "./gemma"

const app = express()
app.use(cors())
app.use(express.json())

// Route de test : sert uniquement à vérifier que le serveur tourne
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" })
})

const bodySchema = z.object({ issueUrl: z.string().url() })

app.post("/api/analyze", async (req, res) => {
  const parsed = bodySchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: "issueUrl invalide" })
  }

  try {
    const issue = await fetchIssue(parsed.data.issueUrl)
    const analysis = await analyzeIssue(issue)
    res.json({ issue, analysis })
  } catch (error) {
    console.error(error)
    const message = error instanceof Error ? error.message : "Erreur inconnue"
    res.status(500).json({ error: message })
  }
})

const port = Number(process.env.PORT ?? 3001)
app.listen(port, () => {
  console.log(`API prête sur http://localhost:${port}`)
})