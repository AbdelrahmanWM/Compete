import { Line, LineChart, ResponsiveContainer } from 'recharts'

type PriceSparklineProps = {
  data: number[]
  compact?: boolean
}

export default function PriceSparkline({ data, compact = false }: PriceSparklineProps) {
  const chartData = data.map((price, index) => ({
    index,
    price,
  }))

  const isIncreasing = data[data.length - 1] > data[0]

  return (
    <div className={compact ? 'h-8' : 'h-12'}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="price"
            stroke={isIncreasing ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
