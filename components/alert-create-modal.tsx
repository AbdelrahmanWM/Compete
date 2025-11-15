'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'

interface AlertCreateModalProps {
  open: boolean
  onClose: () => void
  onCreateAlert: (alert: any) => void
}

const products = [
  { id: '1', name: 'Wireless Gaming Mouse', image: '/wireless-gaming-mouse.png' },
  { id: '2', name: 'Mechanical Keyboard RGB', image: '/mechanical-keyboard-rgb.jpg' },
  { id: '3', name: '4K Gaming Monitor', image: '/4k-gaming-monitor.png' },
  { id: '4', name: 'USB-C Hub', image: '/usb-c-hub.jpg' },
  { id: '5', name: 'Wireless Earbuds Pro', image: '/wireless-earbuds.png' },
]

const competitors = ['TechElite', 'ValueTech', 'GamerPro', 'SmartHome Plus', 'BudgetBytes']

const conditions = [
  { value: 'price_drop', label: 'Price drop' },
  { value: 'stock_low', label: 'Stock below threshold' },
  { value: 'new_promotion', label: 'New promotion' },
  { value: 'rating_change', label: 'Rating change' },
  { value: 'back_in_stock', label: 'Back in stock' },
]

export function AlertCreateModal({ open, onClose, onCreateAlert }: AlertCreateModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    productId: '',
    competitor: '',
    condition: '',
    threshold: '',
  })

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleCreate = () => {
    const product = products.find((p) => p.id === formData.productId)
    const condition = conditions.find((c) => c.value === formData.condition)

    if (product && condition) {
      onCreateAlert({
        productName: product.name,
        productImage: product.image,
        competitor: formData.competitor,
        condition: condition.label,
        threshold: formData.threshold,
        currentValue: 'N/A',
        status: 'active' as const,
        lastTriggered: 'Never',
        createdAt: new Date().toISOString(),
      })
      // Reset form
      setFormData({
        productId: '',
        competitor: '',
        condition: '',
        threshold: '',
      })
      setStep(1)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.productId !== ''
      case 2:
        return formData.condition !== ''
      case 3:
        return formData.threshold !== '' && formData.competitor !== ''
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Alert</DialogTitle>
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex-1">
                <div
                  className={`h-2 rounded-full transition-colors ${
                    s <= step ? 'bg-purple-500' : 'bg-muted'
                  }`}
                />
              </div>
            ))}
          </div>
        </DialogHeader>

        <div className="py-6">
          {/* Step 1: Select Product */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Select Product</h3>
                <p className="text-sm text-muted-foreground">
                  Choose the product you want to monitor
                </p>
              </div>
              <div className="grid gap-3">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setFormData({ ...formData, productId: product.id })}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                      formData.productId === product.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-border hover:border-purple-500/50'
                    }`}
                  >
                    <div className="h-3 w-3 rounded-full border-2 border-current flex items-center justify-center">
                      {formData.productId === product.id && (
                        <div className="h-1.5 w-1.5 rounded-full bg-current" />
                      )}
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Condition */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Select Condition</h3>
                <p className="text-sm text-muted-foreground">
                  What type of change do you want to monitor?
                </p>
              </div>
              <div className="grid gap-3">
                {conditions.map((condition) => (
                  <button
                    key={condition.value}
                    onClick={() => setFormData({ ...formData, condition: condition.value })}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                      formData.condition === condition.value
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-border hover:border-purple-500/50'
                    }`}
                  >
                    <div className="h-3 w-3 rounded-full border-2 border-current flex items-center justify-center">
                      {formData.condition === condition.value && (
                        <div className="h-1.5 w-1.5 rounded-full bg-current" />
                      )}
                    </div>
                    <span className="font-medium">{condition.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Set Threshold */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Set Threshold & Competitor</h3>
                <p className="text-sm text-muted-foreground">
                  Define when the alert should trigger
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="competitor">Competitor</Label>
                  <Select
                    value={formData.competitor}
                    onValueChange={(value) =>
                      setFormData({ ...formData, competitor: value })
                    }
                  >
                    <SelectTrigger id="competitor">
                      <SelectValue placeholder="Select competitor" />
                    </SelectTrigger>
                    <SelectContent>
                      {competitors.map((comp) => (
                        <SelectItem key={comp} value={comp}>
                          {comp}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="threshold">Threshold Value</Label>
                  <Input
                    id="threshold"
                    placeholder="e.g., Price < $150 or Stock < 10 units"
                    value={formData.threshold}
                    onChange={(e) =>
                      setFormData({ ...formData, threshold: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Confirm Alert</h3>
                <p className="text-sm text-muted-foreground">
                  Review your alert settings before creating
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Product</div>
                  <div className="font-medium">
                    {products.find((p) => p.id === formData.productId)?.name}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Competitor</div>
                  <div className="font-medium">{formData.competitor}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Condition</div>
                  <div className="font-medium">
                    {conditions.find((c) => c.value === formData.condition)?.label}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Threshold</div>
                  <div className="font-mono font-medium">{formData.threshold}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Step {step} of 4
          </div>
          <div className="flex gap-2">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
            {step < 4 ? (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleCreate} disabled={!canProceed()}>
                <Check className="h-4 w-4 mr-1" />
                Create Alert
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
