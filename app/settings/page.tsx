'use client'

import { useState } from 'react'
import { Bell, Globe, Layout, Moon, RefreshCw, Camera, DollarSign, Download, Trash2, Activity } from 'lucide-react'
import { SettingsSection } from '@/components/settings-section'
import { ToggleRow } from '@/components/toggle-row'
import { SliderRow } from '@/components/slider-row'
import { IntegrationCard } from '@/components/integration-card'
import { ConfirmModal } from '@/components/confirm-modal'
import { IntegrationModal } from '@/components/integration-modal'
import { LogList } from '@/components/log-list'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const integrations = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send alerts and updates to Slack channels',
    status: 'connected' as const,
    icon: '💬',
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Receive notifications via email',
    status: 'connected' as const,
    icon: '📧',
  },
  {
    id: 'webhook',
    name: 'Webhook',
    description: 'Send data to custom webhook endpoints',
    status: 'not_connected' as const,
    icon: '🔗',
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Get alerts in your Discord server',
    status: 'not_connected' as const,
    icon: '🎮',
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect to 5000+ apps via Zapier',
    status: 'not_connected' as const,
    icon: '⚡',
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    description: 'Share insights with your team',
    status: 'not_connected' as const,
    icon: '👥',
  },
]

const syncLogs = [
  { id: 1, timestamp: '2025-01-15 14:32:00', description: 'Synced 12 competitor products from TechElite', status: 'success' },
  { id: 2, timestamp: '2025-01-15 14:15:00', description: 'Price update detected for 8 products', status: 'success' },
  { id: 3, timestamp: '2025-01-15 14:00:00', description: 'Captured screenshots for GamerPro homepage', status: 'success' },
  { id: 4, timestamp: '2025-01-15 13:45:00', description: 'Failed to fetch data from ValueTech API', status: 'error' },
  { id: 5, timestamp: '2025-01-15 13:30:00', description: 'Synced ratings and reviews for 15 products', status: 'success' },
  { id: 6, timestamp: '2025-01-15 13:15:00', description: 'Stock availability updated for SmartHome Plus', status: 'success' },
  { id: 7, timestamp: '2025-01-15 13:00:00', description: 'Alert triggered: Price drop on Wireless Gaming Mouse', status: 'warning' },
]

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [compactLayout, setCompactLayout] = useState(false)
  const [language, setLanguage] = useState('en')
  const [defaultTimeRange, setDefaultTimeRange] = useState('7d')
  const [refreshFrequency, setRefreshFrequency] = useState(2)
  const [agentAPI, setAgentAPI] = useState(true)
  const [screenshotCapture, setScreenshotCapture] = useState(true)
  const [priceSensitivity, setPriceSensitivity] = useState(50)
  const [showClearModal, setShowClearModal] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<typeof integrations[0] | null>(null)

  const getRefreshLabel = (value: number) => {
    const minutes = [0.5, 1, 2, 5, 10]
    return minutes[value] < 1 ? `${minutes[value] * 60}s` : `${minutes[value]}m`
  }

  const getSensitivityLabel = (value: number) => {
    if (value < 30) return 'Low'
    if (value < 70) return 'Medium'
    return 'High'
  }

  const handleExport = (type: string) => {
    console.log(`Exporting ${type}...`)
  }

  const handleClearData = () => {
    console.log('Clearing data...')
    setShowClearModal(false)
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your preferences, tracking configuration, and integrations
          </p>
        </div>

        {/* User Preferences */}
        <SettingsSection
          title="User Preferences"
          description="Customize your dashboard experience"
        >
          <div className="space-y-4">
            <ToggleRow
              icon={<Moon className="h-5 w-5" />}
              label="Dark Mode"
              description="Use dark theme across the dashboard"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
            <ToggleRow
              icon={<Bell className="h-5 w-5" />}
              label="Email Notifications"
              description="Receive alerts and updates via email"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
            <ToggleRow
              icon={<Layout className="h-5 w-5" />}
              label="Compact Layout"
              description="Reduce spacing and padding for dense views"
              checked={compactLayout}
              onCheckedChange={setCompactLayout}
            />

            <div className="grid gap-4 pt-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Globe className="h-4 w-4" />
                  Language
                </label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Activity className="h-4 w-4" />
                  Default Time Range
                </label>
                <Select value={defaultTimeRange} onValueChange={setDefaultTimeRange}>
                  <SelectTrigger className="bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Last 24 hours</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Tracking Settings */}
        <SettingsSection
          title="Tracking Settings"
          description="Configure how data is collected and monitored"
        >
          <div className="space-y-6">
            <SliderRow
              icon={<RefreshCw className="h-5 w-5" />}
              label="Refresh Frequency"
              description="How often to check for updates"
              value={refreshFrequency}
              onValueChange={setRefreshFrequency}
              min={0}
              max={4}
              step={1}
              displayValue={getRefreshLabel(refreshFrequency)}
            />

            <ToggleRow
              icon={<Activity className="h-5 w-5" />}
              label="Agent API"
              description="Enable automated data collection via API"
              checked={agentAPI}
              onCheckedChange={setAgentAPI}
            />

            <ToggleRow
              icon={<Camera className="h-5 w-5" />}
              label="Screenshot Capture"
              description="Automatically capture competitor page screenshots"
              checked={screenshotCapture}
              onCheckedChange={setScreenshotCapture}
            />

            <SliderRow
              icon={<DollarSign className="h-5 w-5" />}
              label="Price Sensitivity"
              description="Threshold for triggering price change alerts"
              value={priceSensitivity}
              onValueChange={setPriceSensitivity}
              min={0}
              max={100}
              step={10}
              displayValue={getSensitivityLabel(priceSensitivity)}
            />
          </div>
        </SettingsSection>

        {/* Integrations */}
        <SettingsSection
          title="Integrations"
          description="Connect external services to receive alerts and sync data"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {integrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onClick={() => setSelectedIntegration(integration)}
              />
            ))}
          </div>
        </SettingsSection>

        {/* Data Management */}
        <SettingsSection
          title="Data Management"
          description="Export, sync, and manage your tracking data"
        >
          <div className="space-y-6">
            <Card className="border-border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Export Data</h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleExport('competitors')}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export Competitors
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExport('products')}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export Products
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExport('alerts')}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export Alerts
                </Button>
              </div>
            </Card>

            <Card className="border-border bg-card p-6">
              <h3 className="mb-2 text-lg font-semibold text-foreground">Danger Zone</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Permanently delete all tracking data. This action cannot be undone.
              </p>
              <Button
                variant="destructive"
                onClick={() => setShowClearModal(true)}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear All Data
              </Button>
            </Card>

            <Card className="border-border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Sync Log</h3>
              <LogList logs={syncLogs} />
            </Card>
          </div>
        </SettingsSection>
      </div>

      {/* Clear Data Confirmation Modal */}
      <ConfirmModal
        open={showClearModal}
        onOpenChange={setShowClearModal}
        title="Clear All Data"
        description="Are you sure you want to delete all tracking data? This action cannot be undone and will permanently remove all competitors, products, alerts, and historical data."
        confirmText="Clear Data"
        cancelText="Cancel"
        onConfirm={handleClearData}
        variant="destructive"
      />

      {/* Integration Modal */}
      {selectedIntegration && (
        <IntegrationModal
          open={!!selectedIntegration}
          onOpenChange={(open) => !open && setSelectedIntegration(null)}
          integration={selectedIntegration}
        />
      )}
    </div>
  )
}
