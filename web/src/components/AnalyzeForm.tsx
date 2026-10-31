import { useState, type FormEvent } from "react"
import { ArrowRight, LoaderCircle, WandSparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type AnalyzeFormProps = { onAnalyze: (url: string) => Promise<boolean>; loading: boolean }

function GitHubMark() { return <svg className="size-5 fill-slate-950" viewBox="0 0 19 19" aria-hidden="true"><use href="/icons.svg#github-icon" /></svg> }

export function AnalyzeForm({ onAnalyze, loading }: AnalyzeFormProps) {
  const [url, setUrl] = useState("")
  async function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const trimmed = url.trim(); if (trimmed && await onAnalyze(trimmed)) setUrl("") }
  return <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row"><div className="relative flex-1"><span className="pointer-events-none absolute left-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-[#f0f0e9]"><GitHubMark /></span><Input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="github.com/propriétaire/dépôt/issues/123" disabled={loading} className="h-12 rounded-lg border-[#d6d7ce] bg-white pl-12 text-[#20211d] placeholder:text-[#98998f] shadow-none focus-visible:border-[#788a5b] focus-visible:ring-[#dbe7c9]" aria-label="Lien de l’issue GitHub" /></div><Button type="submit" disabled={loading} className="h-12 rounded-lg bg-[#20211d] px-5 font-semibold text-white shadow-none hover:bg-[#40423b]">{loading ? <><LoaderCircle className="size-4 animate-spin" /> Analyse en cours</> : <><WandSparkles className="size-4 text-[#c7db9e]" /> Générer le plan <ArrowRight className="size-4" /></>}</Button></form>
}
