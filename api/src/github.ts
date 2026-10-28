export type GithubIssue = {
  title: string
  body: string
  url: string
  labels: string[]
  repo: string
  number: number
}

type GithubApiIssue = {
  title: string
  body: string | null
  html_url: string
  labels: { name: string }[]
}

const ISSUE_URL = /github\.com\/([\w.-]+)\/([\w.-]+)\/issues\/(\d+)/

export async function fetchIssue(issueUrl: string): Promise<GithubIssue> {
  const match = issueUrl.match(ISSUE_URL)
  if (!match) {
    throw new Error("URL d'issue GitHub invalide")
  }
  const [, owner, repo, number] = match

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues/${number}`,
    { headers: { Accept: "application/vnd.github+json", "User-Agent": "issuementor" } },
  )
  if (!res.ok) {
    throw new Error(`GitHub a répondu ${res.status}`)
  }

  const data = (await res.json()) as GithubApiIssue

  return {
    title: data.title,
    body: (data.body ?? "").slice(0, 6000),
    url: data.html_url,
    labels: data.labels.map((l) => l.name),
    repo: `${owner}/${repo}`,
    number: Number(number),
  }
}

export function normalizeIssueUrl(issueUrl: string): string | null {
  const match = issueUrl.match(ISSUE_URL)
  if (!match) return null
  const [, owner, repo, number] = match
  return `https://github.com/${owner.toLowerCase()}/${repo.toLowerCase()}/issues/${number}`
}