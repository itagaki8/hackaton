import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { difficultyStyles, statusLabels, statuses } from "@/constants"
import type { Issue, Status } from "@/types"

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button type="button" size="sm" variant="outline" onClick={handleCopy}>
      {copied ? "Copié ✓" : "Copier"}
    </Button>
  )
}

type IssueCardProps = {
  issue: Issue
  onStatusChange: (id: number, status: Status) => void
  onDelete: (id: number) => void
}

export function IssueCard({ issue, onStatusChange, onDelete }: IssueCardProps) {
  const { analysis } = issue

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg">{issue.title}</CardTitle>
          <Badge className={difficultyStyles[analysis.difficulty]}>
            {analysis.difficulty}
          </Badge>
        </div>
        <CardDescription>
          <a href={issue.url} target="_blank" rel="noreferrer" className="underline">
            {issue.repo}#{issue.number}
          </a>
        </CardDescription>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {issue.labels.map((label) => (
            <Badge key={label} variant="outline">
              {label}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm">{analysis.summary}</p>

        <details className="rounded-md border p-3">
          <summary className="cursor-pointer text-sm font-medium">
            Voir le plan de contribution
          </summary>

          <div className="mt-3 space-y-4 text-sm">
            <section>
              <h4 className="font-semibold">Compétences</h4>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {analysis.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </section>

            <section>
              <h4 className="font-semibold">Étapes</h4>
              <ol className="mt-1 list-decimal space-y-1 pl-5">
                {analysis.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </section>

            <section>
              <h4 className="font-semibold">Fichiers à regarder</h4>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {analysis.filesToCheck.map((file, i) => (
                  <li key={i}>{file}</li>
                ))}
              </ul>
            </section>

            <section className="space-y-2">
              <h4 className="font-semibold">Brouillon de Pull Request</h4>
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-xs">{analysis.prTitle}</p>
                <CopyButton text={analysis.prTitle} />
              </div>
              <div className="flex items-start justify-between gap-2">
                <p className="text-muted-foreground">{analysis.prDescription}</p>
                <CopyButton text={analysis.prDescription} />
              </div>
            </section>
          </div>
        </details>
      </CardContent>

      <CardFooter className="flex flex-wrap justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <Button
              key={status}
              size="sm"
              variant={issue.status === status ? "default" : "outline"}
              onClick={() => onStatusChange(issue.id, status)}
            >
              {statusLabels[status]}
            </Button>
          ))}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            if (window.confirm("Supprimer cette issue ?")) onDelete(issue.id)
          }}
        >
          Supprimer
        </Button>
      </CardFooter>
    </Card>
  )
}