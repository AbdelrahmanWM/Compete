import { Slider } from '@/components/ui/slider'

interface SliderRowProps {
  icon: React.ReactNode
  label: string
  description: string
  value: number
  onValueChange: (value: number) => void
  min: number
  max: number
  step: number
  displayValue: string
}

export function SliderRow({
  icon,
  label,
  description,
  value,
  onValueChange,
  min,
  max,
  step,
  displayValue,
}: SliderRowProps) {
  return (
    <div className="space-y-3 rounded-lg border border-border bg-background/50 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-muted-foreground">{icon}</div>
        <div className="flex-1 space-y-0.5">
          <div className="flex items-center justify-between">
            <div className="font-medium text-foreground">{label}</div>
            <div className="text-sm font-semibold text-primary">{displayValue}</div>
          </div>
          <div className="text-sm text-muted-foreground">{description}</div>
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onValueChange(v)}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  )
}
