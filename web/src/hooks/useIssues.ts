import { useEffect, useState } from "react"
import * as api from "@/lib/api"
import type { Issue, Status } from "@/types"

function getMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback
}

export function useIssues() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Au premier affichage de la page : charger les issues enregistrées
  useEffect(() => {
    api
      .fetchIssues()
      .then(setIssues)
      .catch((e: unknown) => setError(getMessage(e, "Chargement impossible")))
      .finally(() => setLoading(false))
  }, [])

  async function analyze(issueUrl: string): Promise<boolean> {
    setAnalyzing(true)
    setError(null)
    try {
      const { issue } = await api.analyzeIssue(issueUrl)
      setIssues((prev) => [issue, ...prev.filter((i) => i.id !== issue.id)])
      return true
    } catch (e) {
      setError(getMessage(e, "Analyse impossible"))
      return false
    } finally {
      setAnalyzing(false)
    }
  }

  async function changeStatus(id: number, status: Status) {
    try {
      const updated = await api.updateStatus(id, status)
      setIssues((prev) => prev.map((i) => (i.id === id ? updated : i)))
    } catch (e) {
      setError(getMessage(e, "Mise à jour impossible"))
    }
  }

  async function remove(id: number) {
    try {
      await api.deleteIssue(id)
      setIssues((prev) => prev.filter((i) => i.id !== id))
    } catch (e) {
      setError(getMessage(e, "Suppression impossible"))
    }
  }

  return { issues, loading, analyzing, error, analyze, changeStatus, remove }
}