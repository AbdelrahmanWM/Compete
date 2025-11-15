import { Card } from '@/components/ui/card'

interface SettingsSectionProps {
  title: string
  description: string
  children: React.ReactNode
}

export function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <Card className="border-border bg-card p-6">{children}</Card>
    </div>
  )
}
