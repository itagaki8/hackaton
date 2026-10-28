import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type AnalyzeFormProps = {
  onAnalyze: (url: string) => Promise<boolean>
  loading: boolean
}

export function AnalyzeForm({ onAnalyze, loading }: AnalyzeFormProps) {
  const [url, setUrl] = useState("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) return

    const success = await onAnalyze(trimmed)
    if (success) setUrl("") // on vide le champ seulement si ça a marché
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://github.com/proprietaire/depot/issues/123"
        disabled={loading}
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Analyse en cours…" : "Analyser"}
      </Button>
    </form>
  )
}