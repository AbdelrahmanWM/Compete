'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Plus, LayoutGrid, Table2, List, Clock, Camera } from 'lucide-react'
import { AlertCard } from '@/components/alert-card'
import { AlertTable } from '@/components/alert-table'
import { AlertFeed } from '@/components/alert-feed'
import { AlertTimeline } from '@/components/alert-timeline'
import { ScreenshotGallery } from '@/components/screenshot-gallery'
import { AlertCreateModal } from '@/components/alert-create-modal'

// Mock alert data
const mockAlerts = [
  {
    id: '1',
    productName: 'Wireless Gaming Mouse',
    productImage: '/wireless-gaming-mouse.png',
    competitor: 'TechElite',
    condition: 'Price drop',
    threshold: 'Price < $150',
    currentValue: '$139.99',
    status: 'active' as const,
    lastTriggered: '2 hours ago',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    productName: 'Mechanical Keyboard RGB',
    productImage: '/mechanical-keyboard-rgb.jpg',
    competitor: 'GamerPro',
    condition: 'Stock below threshold',
    threshold: 'Stock < 10 units',
    currentValue: '5 units',
    status: 'active' as const,
    lastTriggered: '5 hours ago',
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    productName: '4K Gaming Monitor',
    productImage: '/4k-gaming-monitor.png',
    competitor: 'ValueTech',
    condition: 'New promotion',
    threshold: 'Discount > 20%',
    currentValue: '25% off',
    status: 'paused' as const,
    lastTriggered: '1 day ago',
    createdAt: '2024-01-10',
  },
  {
    id: '4',
    productName: 'USB-C Hub',
    productImage: '/usb-c-hub.jpg',
    competitor: 'TechElite',
    condition: 'Rating change',
    threshold: 'Rating drops below 4.5',
    currentValue: '4.3 stars',
    status: 'active' as const,
    lastTriggered: '3 days ago',
    createdAt: '2024-01-08',
  },
  {
    id: '5',
    productName: 'Wireless Earbuds Pro',
    productImage: '/wireless-earbuds.png',
    competitor: 'BudgetBytes',
    condition: 'Back in stock',
    threshold: 'Stock > 0',
    currentValue: '23 units',
    status: 'active' as const,
    lastTriggered: '6 hours ago',
    createdAt: '2024-01-12',
  },
]

const mockTriggers = [
  {
    id: '1',
    alertId: '1',
    productName: 'Wireless Gaming Mouse',
    competitor: 'TechElite',
    condition: 'Price drop',
    previousValue: '$159.99',
    newValue: '$139.99',
    triggeredAt: '2 hours ago',
    screenshot: true,
  },
  {
    id: '2',
    alertId: '5',
    productName: 'Wireless Earbuds Pro',
    competitor: 'BudgetBytes',
    condition: 'Back in stock',
    previousValue: '0 units',
    newValue: '23 units',
    triggeredAt: '6 hours ago',
    screenshot: true,
  },
  {
    id: '3',
    alertId: '2',
    productName: 'Mechanical Keyboard RGB',
    competitor: 'GamerPro',
    condition: 'Stock below threshold',
    previousValue: '12 units',
    newValue: '5 units',
    triggeredAt: '5 hours ago',
    screenshot: false,
  },
]

export default function AlertsPage() {
  const [viewMode, setViewMode] = useState<'cards' | 'table' | 'feed'>('cards')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [alerts, setAlerts] = useState(mockAlerts)

  const handleToggleAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id 
        ? { ...alert, status: alert.status === 'active' ? 'paused' as const : 'active' as const }
        : alert
    ))
  }

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id))
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Alerts Center</h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage your product alerts
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Alert
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm text-muted-foreground">Total Alerts</div>
            <div className="mt-1 text-2xl font-bold text-foreground">{alerts.length}</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm text-muted-foreground">Active</div>
            <div className="mt-1 text-2xl font-bold text-green-500">
              {alerts.filter(a => a.status === 'active').length}
            </div>
          </div>
          
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm text-muted-foreground">Paused</div>
            <div className="mt-1 text-2xl font-bold text-muted-foreground">
              {alerts.filter(a => a.status === 'paused').length}
            </div>
          </div>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="alerts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="alerts" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <Clock className="h-4 w-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="screenshots" className="gap-2">
              <Camera className="h-4 w-4" />
              Screenshots
            </TabsTrigger>
          </TabsList>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-4">
            {/* View Mode Selector */}
            <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
              <div className="text-sm text-muted-foreground">
                Showing {alerts.length} alerts
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className="gap-2"
                >
                  <LayoutGrid className="h-4 w-4" />
                  Cards
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="gap-2"
                >
                  <Table2 className="h-4 w-4" />
                  Table
                </Button>
                <Button
                  variant={viewMode === 'feed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('feed')}
                  className="gap-2"
                >
                  <List className="h-4 w-4" />
                  Feed
                </Button>
              </div>
            </div>

            {/* Alert Views */}
            {viewMode === 'cards' && (
              <div className="grid gap-4 md:grid-cols-2">
                {alerts.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onToggle={handleToggleAlert}
                    onDelete={handleDeleteAlert}
                  />
                ))}
              </div>
            )}

            {viewMode === 'table' && (
              <AlertTable
                alerts={alerts}
                onToggle={handleToggleAlert}
                onDelete={handleDeleteAlert}
              />
            )}

            {viewMode === 'feed' && (
              <AlertFeed
                alerts={alerts}
                onToggle={handleToggleAlert}
              />
            )}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <AlertTimeline triggers={mockTriggers} />
          </TabsContent>

          {/* Screenshots Tab */}
          <TabsContent value="screenshots">
            <ScreenshotGallery triggers={mockTriggers.filter(t => t.screenshot)} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Alert Modal */}
      <AlertCreateModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateAlert={(newAlert) => {
          setAlerts([...alerts, { ...newAlert, id: String(alerts.length + 1) }])
          setIsCreateModalOpen(false)
        }}
      />
    </div>
  )
}
