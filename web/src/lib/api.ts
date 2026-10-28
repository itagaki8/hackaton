import type { Issue, Status } from "@/types"

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...init,
  })

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null
    throw new Error(data?.error ?? `Erreur ${res.status}`)
  }

  if (res.status === 204) {
    return undefined as T
  }
  return (await res.json()) as T
}

export function fetchIssues(): Promise<Issue[]> {
  return request<Issue[]>("/api/issues")
}

export function analyzeIssue(issueUrl: string): Promise<{ issue: Issue; cached: boolean }> {
  return request("/api/analyze", {
    method: "POST",
    body: JSON.stringify({ issueUrl }),
  })
}

export function updateStatus(id: number, status: Status): Promise<Issue> {
  return request(`/api/issues/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}

export function deleteIssue(id: number): Promise<void> {
  return request<void>(`/api/issues/${id}`, { method: "DELETE" })
}