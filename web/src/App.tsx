import { useState } from "react"
import { ArrowUpRight, CircleDotDashed, GitPullRequest, Plus, Sparkles } from "lucide-react"
import { AnalyzeForm } from "@/components/AnalyzeForm"
import { IssueCard } from "@/components/IssueCard"
import { Button } from "@/components/ui/button"
import { statusLabels, statuses } from "@/constants"
import { useIssues } from "@/hooks/useIssues"
import type { Status } from "@/types"

type Filter = Status | "ALL"

function GitHubMark({ className = "" }: { className?: string }) { return <svg className={className} viewBox="0 0 19 19" aria-hidden="true"><use href="/icons.svg#github-icon" /></svg> }

export default function App() {
  const { issues, loading, analyzing, error, analyze, changeStatus, remove } = useIssues()
  const [filter, setFilter] = useState<Filter>("ALL")
  const visible = filter === "ALL" ? issues : issues.filter((issue) => issue.status === filter)
  const count = (status: Status) => issues.filter((issue) => issue.status === status).length
  const completed = count("PR_SENT")

  return <main className="min-h-screen bg-[#f7f7f2] px-4 py-5 text-[#20211d] sm:px-8 sm:py-8">
    <div className="mx-auto max-w-[1280px]">
      <nav className="flex items-center justify-between border-b border-[#deded5] pb-5"><a href="/" className="flex items-center gap-2.5"><span className="grid size-9 place-items-center rounded-full bg-[#20211d]"><GitHubMark className="size-4 fill-white" /></span><span className="text-[15px] font-semibold tracking-tight">IssueMentor</span></a><div className="flex items-center gap-4 text-xs font-medium text-[#777970]"><span className="hidden sm:inline">Open source, plus simplement.</span><span className="flex items-center gap-1.5 text-emerald-700"><span className="size-1.5 rounded-full bg-emerald-500" /> En ligne</span></div></nav>

      <header className="grid gap-10 py-14 sm:py-16 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end"><div><div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#e9eee2] px-3 py-1.5 text-xs font-semibold text-[#546040]"><Sparkles className="size-3.5" /> Votre espace de contribution</div><h1 className="max-w-4xl text-4xl font-semibold leading-[.98] tracking-[-0.055em] text-[#20211d] sm:text-6xl">Des issues claires.<br /><em className="font-serif font-normal text-[#66734e]">Des contributions</em> qui comptent.</h1><p className="mt-6 max-w-2xl text-[15px] leading-7 text-[#65675f]">Un espace simple pour comprendre une issue GitHub, savoir par où commencer et suivre votre progression sans vous perdre.</p></div><div className="border-l border-[#deded5] pl-6"><p className="text-4xl font-semibold tracking-[-0.05em]">{issues.length}</p><p className="mt-1 text-sm text-[#777970]">issue{issues.length > 1 ? "s" : ""} dans votre liste</p><div className="my-5 h-px bg-[#deded5]" /><p className="flex items-center gap-2 text-sm text-[#777970]"><GitPullRequest className="size-4 text-[#66734e]" /><strong className="font-semibold text-[#20211d]">{completed}</strong> PR envoyée{completed > 1 ? "s" : ""}</p></div></header>

      <section className="border-y border-[#deded5] py-5 sm:py-6"><div className="mb-4 flex items-center gap-2 text-sm font-semibold"><span className="grid size-7 place-items-center rounded-full bg-[#dbe7c9] text-[#52643a]"><Plus className="size-4" /></span> Nouvelle contribution</div><AnalyzeForm onAnalyze={analyze} loading={analyzing} />{error && <p className="mt-3 border-l-2 border-rose-500 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}</section>

      <section className="pt-12" aria-labelledby="issues-heading"><div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#808278]">Votre parcours</p><h2 id="issues-heading" className="text-2xl font-semibold tracking-[-0.04em]">Contributions en cours</h2></div><div className="flex flex-wrap gap-x-4 gap-y-2" role="group" aria-label="Filtrer les issues"><Button size="sm" variant="ghost" className={`h-auto rounded-none px-0 py-1 text-sm ${filter === "ALL" ? "border-b-2 border-[#20211d] font-semibold text-[#20211d] hover:bg-transparent" : "text-[#777970] hover:bg-transparent hover:text-[#20211d]"}`} onClick={() => setFilter("ALL")}>Toutes <span className="ml-1.5 text-xs opacity-60">{issues.length}</span></Button>{statuses.map((status) => <Button key={status} size="sm" variant="ghost" className={`h-auto rounded-none px-0 py-1 text-sm ${filter === status ? "border-b-2 border-[#20211d] font-semibold text-[#20211d] hover:bg-transparent" : "text-[#777970] hover:bg-transparent hover:text-[#20211d]"}`} onClick={() => setFilter(status)}>{statusLabels[status]} <span className="ml-1.5 text-xs opacity-60">{count(status)}</span></Button>)}</div></div>
        <div className="mt-6 space-y-4">{loading && <div className="border-t border-[#deded5] py-10 text-sm text-[#777970]">Chargement de votre espace…</div>}{!loading && visible.length === 0 && <div className="border-y border-dashed border-[#d8d8cd] py-16 text-center"><span className="mx-auto grid size-11 place-items-center rounded-full bg-[#e9eee2] text-[#66734e]"><CircleDotDashed className="size-5" /></span><p className="mt-4 font-semibold">Votre prochaine contribution est à choisir.</p><p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-[#777970]">Ajoutez une issue GitHub ci-dessus, puis laissez-vous guider.</p></div>}{visible.map((issue) => <IssueCard key={issue.id} issue={issue} onStatusChange={changeStatus} onDelete={remove} />)}</div>
      </section>
      <footer className="flex items-center justify-between py-12 text-xs text-[#8b8d84]"><span>IssueMentor · contribuer avec confiance</span><a className="inline-flex items-center gap-1 hover:text-[#20211d]" href="https://github.com" target="_blank" rel="noreferrer">GitHub <ArrowUpRight className="size-3" /></a></footer>
    </div>
  </main>
}
