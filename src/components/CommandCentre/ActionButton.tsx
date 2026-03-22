import Link from 'next/link'

interface ActionButtonProps {
  label: string
  href: string
  colorTokens: {
    actionFill: string
    actionText: string
    actionBorder: string
  }
  onClick?: () => void
}

export default function ActionButton({ label, href, colorTokens, onClick }: ActionButtonProps) {
  const style = {
    backgroundColor: colorTokens.actionFill,
    borderColor: colorTokens.actionBorder,
    color: colorTokens.actionText,
  }

  if (onClick) {
    return (
      <button
        className="action-button"
        style={style}
        onClick={onClick}
        type="button"
      >
        <span className="action-button__label">{label}</span>
      </button>
    )
  }

  return (
    <Link href={href} className="action-button" style={style}>
      <span className="action-button__label">{label}</span>
    </Link>
  )
}
