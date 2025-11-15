'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Integration {
  id: string
  name: string
  description: string
  status: 'connected' | 'not_connected'
  icon: string
}

interface IntegrationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  integration: Integration
}

export function IntegrationModal({ open, onOpenChange, integration }: IntegrationModalProps) {
  const [apiKey, setApiKey] = useState('')
  const [webhookUrl, setWebhookUrl] = useState('')

  const handleSave = () => {
    console.log('Saving integration:', { integration: integration.id, apiKey, webhookUrl })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{integration.icon}</span>
            <div>
              <DialogTitle className="text-foreground">{integration.name}</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {integration.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-key" className="text-foreground">
              API Key
            </Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-background"
            />
          </div>

          {integration.id === 'webhook' && (
            <div className="space-y-2">
              <Label htmlFor="webhook-url" className="text-foreground">
                Webhook URL
              </Label>
              <Input
                id="webhook-url"
                type="url"
                placeholder="https://your-domain.com/webhook"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="bg-background"
              />
            </div>
          )}

          <div className="rounded-lg border border-border bg-muted/50 p-3">
            <p className="text-sm text-muted-foreground">
              Your credentials are encrypted and stored securely. We will never share your data
              with third parties.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
