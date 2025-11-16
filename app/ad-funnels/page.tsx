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
      url: "https://www.google.com/search?q=adidas+running+shoes",
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
  
  // NEW: job state and popover independence
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [showPopover, setShowPopover] = useState<boolean>(false)

  const [popoverMessage, setPopoverMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [competitors, setCompetitors] = useState<Array<{id:string;name:string}>>([])
  const [filter, setFilter] = useState<string>("")
  const [isLoadingCompetitors, setIsLoadingCompetitors] = useState<boolean>(false)
  const [attemptCount, setAttemptCount] = useState<number>(0)

  const abortControllerRef = React.useRef<AbortController | null>(null)

  const handleCancel = () => {
    abortControllerRef.current?.abort()
    setIsRunning(false)
    setShowPopover(false)
    setError("Cancelled by user")
  }

  React.useEffect(() => {
    return () => abortControllerRef.current?.abort()
  }, [])

  async function handleRun(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    setIsRunning(true)
    setShowPopover(true)
    
    setAttemptCount(0)
    setPopoverMessage("Please hold while the AI agent runs…")

    const comp = competitor || filter
    if (comp && !competitor) setCompetitor(comp)

    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    try {
      const maxAttempts = 3
      let attempt = 0
      let lastError: any = null

      while (attempt < maxAttempts) {
        attempt++
        setAttemptCount(attempt)

        if (attempt === 1)
          setPopoverMessage("Please hold while the AI agent runs…")
        else 
          setPopoverMessage("First route was invalid — trying another route…")

        const res = await fetch('/api/ad-funnels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ competitor: comp, query }),
          signal,
        })

        if (!res.ok) {
          const text = await res.text().catch(() => "")
          lastError = text

          if (attempt < maxAttempts) continue
          setError(`Agent error: ${text}`)
          break
        }

        const data = await res.json().catch(() => null)
        if (!data) {
          if (attempt < maxAttempts) continue
          setError("Invalid agent response")
          break
        }

        if (data.error) {
          lastError = data.error
          if (attempt < maxAttempts) continue
          setError(data.error)
          break
        }

        setFunnelRun(data as FunnelRun)
        lastError = null
        break
      }

      if (lastError && !error) {
        setError(typeof lastError === "string" ? lastError : JSON.stringify(lastError))
      }
    } catch (err: any) {
      if (err.name !== "AbortError")
        setError("Network error: " + err.message)
    } finally {
      setIsRunning(false)
      abortControllerRef.current = null
    }
  }

  React.useEffect(() => {
    let mounted = true

    async function fetchCompetitors() {
      try {
        setIsLoadingCompetitors(true)
        const res = await fetch("/api/competitors")
        if (!res.ok) return
        const json = await res.json().catch(() => null)
        if (!mounted) return
        if (json?.success) setCompetitors(json.data)
      } finally {
        if (mounted) setIsLoadingCompetitors(false)
      }
    }

    fetchCompetitors()
    return () => { mounted = false }
  }, [])

  const filtered = competitors.filter((c) =>
    c.name.toLowerCase().includes(filter.toLowerCase())
  )

  const handleSelectCompetitor = (name: string) => {
    setCompetitor(name)
    setFilter(name)
  }

  const truncate = (s: string, n = 64) => (s.length > n ? s.slice(0, n) + "…" : s)

  const rawStepsForLayout =
    funnelRun?.steps ?? mockRun.steps

  const numberedForLayout = rawStepsForLayout
    .map((s: any, i: number) => ({
      ...s,
      order: typeof s.order === "number" ? s.order : i + 1,
      id: s.id ?? `step_${i + 1}`,
    }))
    .sort((a: any, b: any) => a.order - b.order)

  const stepCount = numberedForLayout.length
  const rowHeight = 112
  const minHeightPx = Math.min(stepCount * rowHeight, 800)

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
          />

          {filter.length > 0 && (!competitor || filter !== competitor) && (
            <div className="absolute left-0 right-0 z-50 mt-1 w-full max-h-40 overflow-y-auto rounded-md border bg-card p-2 shadow-lg">
              {isLoadingCompetitors ? (
                <div className="px-2 py-3 text-sm text-muted-foreground">
                  Loading competitors…
                </div>
              ) : filtered.length === 0 ? (
                <div className="px-2 py-3 text-sm text-muted-foreground">
                  No matches
                </div>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectCompetitor(c.name)}
                    className="text-left rounded-md px-2 py-2 hover:bg-accent/50"
                  >
                    <div className="font-medium">{c.name}</div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <Input
          id="query"
          type="text"
          placeholder="Search query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <Button type="submit" className="flex-1" disabled={isRunning}>
            {isRunning ? "Running…" : "Run Funnel Exploration"}
          </Button>
          {isRunning && (
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {/* POPUP — NOT BLOCKING ANYMORE */}
      {showPopover && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card p-6 rounded-md flex flex-col items-center gap-3">
            <Spinner className="h-8 w-8 text-foreground" />
            <div className="text-sm font-medium">{popoverMessage}</div>
            {attemptCount > 0 && (
              <div className="text-xs text-muted-foreground">
                Attempt {attemptCount} of 3
              </div>
            )}

            <div className="flex gap-2 pt-2">
              {/* Close popover (DOES NOT cancel) */}
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowPopover(false)}
              >
                Hide
              </Button>

              {/* Cancel fetch (actual abort) */}
              <Button
                type="button"
                variant="destructive"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* SMALL BACKGROUND RUNNING INDICATOR */}
      {isRunning && !showPopover && (
        <div className="fixed bottom-4 right-4 z-40 bg-card border px-4 py-3 rounded shadow-lg flex items-center gap-3">
          <Spinner className="h-4 w-4" />
          <span className="text-sm">Running in background…</span>
          <Button size="sm" variant="ghost" onClick={() => setShowPopover(true)}>
            Show
          </Button>
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Graph */}
      <div className="mt-8">
        <FunnelFlowGraph
          data={{
            steps: funnelRun ? funnelRun.steps : [],
            finalPrice: funnelRun?.finalPrice ?? null,
            currency: funnelRun?.currency ?? null,
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
                    <div className="font-medium">
                      {new Date(funnelRun.createdAt).toLocaleString()}
                    </div>
                    <div className="mt-2">
                      <Badge variant="secondary">
                        Final: {funnelRun.currency} {funnelRun.finalPrice}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <ScrollArea style={{ minHeight: `${minHeightPx}px` }}>
                  <div className="flex flex-col divide-y">
                    {numberedForLayout.map((step: any) => (
                      <div key={step.id} className="py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="text-sm text-muted-foreground">
                                Step {step.order}
                              </div>
                              <Badge variant="outline" className="capitalize">
                                {step.type}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {step.currency ?? funnelRun.currency} {step.price ?? ""}
                            </div>
                          </div>

                          <div className="text-base font-semibold">
                            {step.title}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {step.notes}
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            {truncate(step.url, 120)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>

              <CardFooter>
                <div className="flex w-full items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {funnelRun.steps.length} steps
                  </div>
                  <div className="text-sm font-medium">
                    Final total: {funnelRun.currency} {funnelRun.finalPrice}
                  </div>
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
                    <div className="font-medium">
                      {funnelRun.currency} {funnelRun.finalPrice}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="col-span-2 flex items-center justify-center p-12">
              <div className="text-center">
                <h3 className="text-lg font-medium">
                  Run an exploration to see a competitor ad funnel.
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Enter a competitor and query above, then run the exploration.
                </p>
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