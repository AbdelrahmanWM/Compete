"use client"

import React, { useState } from "react"
import { FunnelRun } from "@/types/funnel"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import FunnelFlowGraph from "@/components/funnel-flow-graph"
import { Spinner } from '@/components/ui/spinner'

// Keep an internal mock for fallback or development
const mockRun: FunnelRun = {
  id: "run_001",
  competitor: "GamerPro",
  query: "wireless gaming mouse best deal",
  createdAt: new Date().toISOString(),
  currency: "USD",
  finalPrice: 59.99,
  steps: [
    {
      id: "s1",
      type: "ad",
      url: "https://www.google.com/search?q=adidas+running+shoes&rlz=1C1UEAD_enCA1114CA1114&oq=adidas+run&gs_lcrp=EgZjaHJvbWUqCggAEAAYsQMYgAQyCggAEAAYsQMYgAQyBwgBEAAYgAQyBwgCEAAYgAQyBggDEEUYOTIHCAQQABiABDIKCAUQLhiABBjlBDIHCAYQABiABDIHCAcQABiABDIHCAgQABiABDIHCAkQABiABNIBCDYxMDBqMGo0qAIAsAIB&sourceid=chrome&ie=UTF-8",
      title: "GamerPro Wireless Mouse — Pro Precision",
      notes: "Top-performing search ad with promotional coupon",
      order: 1,
      screenshotUrl: "/placeholder.svg",
    },
    {
      id: "s2",
      type: "landing",
      url: "https://gamerpro.example.com/wireless-mouse?ref=ad",
      title: "GamerPro — Wireless Mouse Landing",
      notes: "Landing contains hero banner + limited time offer",
      order: 2,
      screenshotUrl: "/placeholder.svg",
    },
    {
      id: "s3",
      type: "product",
      url: "https://gamerpro.example.com/products/wireless-mouse-pro",
      title: "Wireless Mouse Pro — 16000 DPI",
      notes: "Product page shows price, variants, and reviews",
      price: 69.99,
      currency: "USD",
      order: 3,
      screenshotUrl: "/placeholder.svg",
    },
    {
      id: "s4",
      type: "checkout",
      url: "https://gamerpro.example.com/checkout?cart=123",
      title: "Checkout — GamerPro",
      notes: "Final checkout page (post-discount)",
      price: 59.99,
      currency: "USD",
      order: 4,
      screenshotUrl: "/placeholder.svg",
    },
  ],
}

export default function AdFunnelsPage() {
  const [funnelRun, setFunnelRun] = useState<FunnelRun | null>(null)
  const [competitor, setCompetitor] = useState<string>("")
  const [query, setQuery] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [competitors, setCompetitors] = useState<Array<{id:string;name:string}>>([])
  const [filter, setFilter] = useState<string>("")
  const [isLoadingCompetitors, setIsLoadingCompetitors] = useState<boolean>(false)
  // attempts removed: no retry behavior — single attempt only
  const abortControllerRef = React.useRef<AbortController | null>(null)
  const [showPopover, setShowPopover] = useState(false)
  const [popoverMessage, setPopoverMessage] = useState<string | null>(null)
  const [attemptCount, setAttemptCount] = useState<number>(0)

  const handleCancel = () => {
    // signal cancellation
    abortControllerRef.current?.abort()
    setIsLoading(false)
    setError("Cancelled by user")
    setShowPopover(false)
  }

  // cleanup on unmount: abort any in-flight request
  React.useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  async function handleRun(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    // reset attempt counter and show popover
    setAttemptCount(0)
    setShowPopover(true)
    setPopoverMessage('Please hold while the AI agent runs…')

    const comp = competitor || filter
    if (comp && !competitor) setCompetitor(comp)

    // perform a single fetch and return the first result or error
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    try {
      // run with retries: up to 3 attempts. If an attempt fails with an 'invalid route' style
      // failure we will retry and update the popover message.
      const maxAttempts = 3
      let attempt = 0
      let lastError: any = null

      while (attempt < maxAttempts) {
        attempt += 1
        setAttemptCount(attempt)
        // update popover message on retry
        if (attempt === 1) setPopoverMessage('Please hold while the AI agent runs…')
        else setPopoverMessage('First route was invalid — trying another route…')

        const res = await fetch('/api/ad-funnels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ competitor: comp, query }),
          signal,
        })

        if (!res.ok) {
          // read body to help debug
          const text = await res.text().catch(() => '(failed to read response body)')
          lastError = { status: res.status, body: text }
          console.error('Agent proxy returned non-ok:', res.status, text)
          // decide whether to retry: if server indicates route invalid (heuristic), retry
          if (attempt < maxAttempts) {
            // continue loop to retry
            continue
          } else {
            setError(`Agent error: ${res.status} ${text}`)
            break
          }
        }

        const data = await res.json().catch((e) => {
          lastError = e
          console.error('Failed parsing agent response json:', e)
          return null
        })

        if (!data) {
          if (attempt < maxAttempts) continue
          setError('Invalid agent response')
          break
        }

        if (data && data.error) {
          lastError = data.error
          console.error('Agent returned error payload:', data)
          // If first attempt failed, show retry message and loop to retry
          if (attempt < maxAttempts) {
            // continue to retry
            continue
          } else {
            setError(typeof data.error === 'string' ? data.error : JSON.stringify(data.error))
            break
          }
        }

        // success
        console.log('Agent proxy returned:', data)
        setFunnelRun(data as FunnelRun)
        lastError = null
        break
      }

      if (lastError) {
        // set a generic message if not already set
        if (!error) setError(typeof lastError === 'string' ? lastError : JSON.stringify(lastError))
      }
    } catch (fetchErr: any) {
      if (fetchErr?.name === 'AbortError') {
        // cancelled by user — handleCancel already sets the UI state
        setPopoverMessage(null)
        setShowPopover(false)
        return
      }
      console.error('Network error calling agent proxy:', fetchErr)
      setError(fetchErr?.message ? `Network error: ${fetchErr.message}` : 'Network error calling agent')
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
      // hide popover after finished or error
      setPopoverMessage(null)
      setShowPopover(false)
    }
  }

  // Fetch competitors for the autocomplete/search
  React.useEffect(() => {
    let mounted = true
    const fetchCompetitors = async () => {
      try {
        setIsLoadingCompetitors(true)
        const res = await fetch("/api/competitors")
        if (!res.ok) return
        const json = await res.json().catch(() => null)
        if (!mounted) return
        if (json && json.success && Array.isArray(json.data)) {
          setCompetitors(json.data)
        }
      } catch (err) {
        console.error("Failed to load competitors:", err)
      } finally {
        if (mounted) setIsLoadingCompetitors(false)
      }
    }

    fetchCompetitors()
    return () => {
      mounted = false
    }
  }, [])

  const filtered = competitors.filter((c) =>
    c.name.toLowerCase().includes(filter.toLowerCase())
  )

  const handleSelectCompetitor = (name: string) => {
    setCompetitor(name)
    setFilter(name)
  }

  const truncate = (s: string, n = 64) => (s.length > n ? s.slice(0, n) + "…" : s)
  // Prepare steps for rendering and compute a responsive min-height for the steps area
  const rawStepsForLayout = funnelRun && Array.isArray(funnelRun.steps) ? funnelRun.steps : (Array.isArray(mockRun.steps) ? mockRun.steps : [])
  const numberedForLayout = rawStepsForLayout.map((s: any, i: number) => ({ ...s, order: typeof s.order === 'number' ? s.order : i + 1, id: s.id ?? `step_${i + 1}` }));
  numberedForLayout.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

  const stepCount = numberedForLayout.length
  const rowHeight = 112 // approx pixel height per step row (increased to account for full-width rows)
  const minHeightPx = Math.min(stepCount * rowHeight, 800) // cap min height so it doesn't grow unbounded

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Ad Funnel Explorer</h1>
          <p className="text-sm text-muted-foreground">
            Simulate competitor ad journeys from search to checkout.
          </p>
        </div>
      </div>

      <form onSubmit={handleRun} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="relative">
          <Label htmlFor="competitor-search" className="sr-only">Competitor</Label>
          <Input
            id="competitor-search"
            placeholder="Competitor (e.g. GamerPro)"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full"
          />

          {/* Dropdown */}
          {filter.length > 0 && (!competitor || filter !== competitor) && (
            <div className="absolute left-0 right-0 z-50 mt-1 w-full max-h-40 overflow-y-auto rounded-md border border-border bg-card p-2 shadow-lg">
              {isLoadingCompetitors ? (
                <div className="flex items-center gap-2 px-2 py-3 text-sm text-muted-foreground">
                  <span>Loading competitors…</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="px-2 py-3 text-sm text-muted-foreground">No matches</div>
              ) : (
                <div className="grid gap-2">
                  {filtered.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectCompetitor(c.name)}
                      className="text-left rounded-md px-2 py-2 hover:bg-accent/50"
                    >
                      <div className="font-medium">{c.name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="query" className="sr-only">Query</Label>
          <Input
            id="query"
            type="text"
            placeholder="Search query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="submit"
            className={isLoading ? 'flex-1' : 'w-full'}
            variant="default"
            disabled={isLoading}
          >
            {isLoading ? `Running...` : "Run Funnel Exploration"}
          </Button>
          {isLoading && (
            <Button type="button" variant="outline" onClick={handleCancel} className="w-28">
              Cancel
            </Button>
          )}
        </div>
      </form>

      {/* Popover overlay shown while agent runs */}
      {showPopover && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card p-6 rounded-md flex flex-col items-center gap-3">
            <Spinner className="h-8 w-8 text-foreground" />
            <div className="text-sm font-medium">{popoverMessage}</div>
            {attemptCount > 0 && <div className="text-xs text-muted-foreground">Attempt {attemptCount} of 3</div>}
            <div className="pt-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Funnel visualization (above the cards) */}
      <div className="mt-8">
        {/* Show real data when available; otherwise render an empty graph section */}
        <FunnelFlowGraph
          data={{
            steps: funnelRun ? (funnelRun.steps as any) : [],
            finalPrice: funnelRun ? (funnelRun.finalPrice ?? null) : null,
            currency: funnelRun ? (funnelRun.currency ?? null) : null,
          }}
        />
      </div>

  <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {funnelRun ? (
          <>
            <Card className="col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle>{funnelRun.competitor}</CardTitle>
                    <CardDescription>
                      Query: <span className="font-medium">{funnelRun.query}</span>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Run at</div>
                    <div className="font-medium">{new Date(funnelRun.createdAt).toLocaleString()}</div>
                    <div className="mt-2">
                      <Badge variant="secondary">
                        Final: {funnelRun.currency ?? ""} {funnelRun.finalPrice ?? "—"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <ScrollArea className="w-full" style={{ minHeight: `${minHeightPx}px` }}>
                  <div className="flex flex-col divide-y">
                    {numberedForLayout.map((step: any) => (
                      <div key={step.id} className="py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="text-sm text-muted-foreground">Step {step.order}</div>
                              <Badge variant="outline" className="capitalize">{step.type}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">{step.currency ?? funnelRun?.currency ?? ""} {step.price ?? ""}</div>
                          </div>

                          <div className="text-base font-semibold">{step.title ?? "(no title)"}</div>
                          <div className="text-sm text-muted-foreground">{step.notes}</div>
                          <div className="text-xs text-muted-foreground mt-2">{truncate(step.url, 120)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>

              <CardFooter>
                <div className="flex w-full items-center justify-between">
                  <div className="text-sm text-muted-foreground">{funnelRun.steps.length} steps</div>
                  <div className="text-sm font-medium">Final total: {funnelRun.currency ?? ""} {funnelRun.finalPrice ?? "—"}</div>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
                <CardDescription>Quick metrics for this simulated run</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Competitor</div>
                    <div className="font-medium">{funnelRun.competitor}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Query</div>
                    <div className="font-medium">{funnelRun.query}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Steps</div>
                    <div className="font-medium">{funnelRun.steps.length}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Final price</div>
                    <div className="font-medium">{funnelRun.currency ?? ""} {funnelRun.finalPrice ?? "—"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="col-span-2 flex items-center justify-center p-12">
                <div className="text-center">
                  <h3 className="text-lg font-medium">Run an exploration to see a competitor ad funnel.</h3>
                  <p className="text-sm text-muted-foreground mt-2">Enter a competitor and query above, then run the exploration.</p>
                </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
                <CardDescription>Quick metrics for this simulated run</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">No run data yet</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}