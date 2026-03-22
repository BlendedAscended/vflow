export interface MetricData {
  id: string
  label: string
  value: string
  delta: string
  actionLabel: string
  actionHref: string
  position: 'left' | 'right'
  colorTokens: {
    fill: string
    border: string
    label: string
    value: string
    delta: string
    actionFill: string
    actionText: string
    actionBorder: string
  }
}
