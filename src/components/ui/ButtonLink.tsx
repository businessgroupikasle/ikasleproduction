import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'

export function ButtonLink({
  to,
  children,
  secondary = false,
  className = '',
}: {
  to: string
  children: ReactNode
  secondary?: boolean
  className?: string
}) {
  return (
    <Link className={`button ${secondary ? 'button-secondary' : ''} ${className}`.trim()} to={to}>
      {children}
      <ArrowUpRight size={17} aria-hidden="true" />
    </Link>
  )
}
