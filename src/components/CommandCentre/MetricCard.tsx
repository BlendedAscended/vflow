import type { MetricData } from './types'
import ActionButton from './ActionButton'

interface MetricCardProps {
  data: MetricData
  style?: React.CSSProperties
  'data-gsap'?: string
}

export default function MetricCard({ data, style, 'data-gsap': dataGsap }: MetricCardProps) {
  const { label, value, delta, actionLabel, actionHref, colorTokens } = data

  const cardStyle: React.CSSProperties = {
    backgroundColor: colorTokens.fill,
    borderColor: colorTokens.border,
    ...style,
  }

  const handleRefresh = data.id === 'conversion' ? () => {
    console.log('Triggering data refresh…')
    // TODO: wire to real API call
  } : undefined

  return (
    <div
      className="metric-card"
      style={cardStyle}
      data-gsap={dataGsap}
    >
      <span className="metric-card__label" style={{ color: colorTokens.label }}>
        {label}
      </span>
      <span className="metric-card__value" style={{ color: colorTokens.value }}>
        {value}
      </span>
      <span className="metric-card__delta" style={{ color: colorTokens.delta }}>
        {delta}
      </span>

      <ActionButton
        label={actionLabel}
        href={actionHref}
        colorTokens={colorTokens}
        onClick={handleRefresh}
      />
    </div>
  )
}
