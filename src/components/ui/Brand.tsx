import { Link } from 'react-router'

export function Brand() {
  return (
    <Link className="brand" to="/" aria-label="IKASLÉ Productions home">
      <span>IKASLÉ</span>
      <small>PRODUCTIONS</small>
    </Link>
  )
}
