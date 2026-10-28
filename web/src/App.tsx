import { useState } from "react"
import { AnalyzeForm } from "@/components/AnalyzeForm"
import { IssueCard } from "@/components/IssueCard"
import { Button } from "@/components/ui/button"
import { statusLabels, statuses } from "@/constants"
import { useIssues } from "@/hooks/useIssues"
import type { Status } from "@/types"

type Filter = Status | "ALL"

export default function App() {
  const { issues, loading, analyzing, error, analyze, changeStatus, remove } = useIssues()
  const [filter, setFilter] = useState<Filter>("ALL")

  const visible = filter === "ALL" ? issues : issues.filter((i) => i.status === filter)
  const count = (status: Status) => issues.filter((i) => i.status === status).length

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">IssueMentor</h1>
        <p className="mt-1 text-muted-foreground">
          Colle le lien d'une issue GitHub : Optennez plus d'orientations pour contribuer effcicacement et en toute confiance.
        </p>
      </header>

      <AnalyzeForm onAnalyze={analyze} loading={analyzing} />
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      <div className="mt-8 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={filter === "ALL" ? "default" : "outline"}
          onClick={() => setFilter("ALL")}
        >
          Toutes ({issues.length})
        </Button>
        {statuses.map((status) => (
          <Button
            key={status}
            size="sm"
            variant={filter === status ? "default" : "outline"}
            onClick={() => setFilter(status)}
          >
            {statusLabels[status]} ({count(status)})
          </Button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {loading && <p className="text-muted-foreground">Chargement…</p>}
        {!loading && visible.length === 0 && (
          <p className="text-muted-foreground">Aucune issue ici pour l'instant.</p>
        )}
        {visible.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            onStatusChange={changeStatus}
            onDelete={remove}
          />
        ))}
      </div>
    </div>
  )
}