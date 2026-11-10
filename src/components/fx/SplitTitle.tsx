import type { CSSProperties } from 'react'

export interface TitleLine {
  text: string
  accent?: boolean
}

interface SplitTitleProps {
  as?: 'h1' | 'h2'
  /** One entry per visual line, so the headline keeps its intended line breaks. */
  lines: readonly TitleLine[]
  className?: string
  id?: string
}

/**
 * A heading whose words rise out of a mask one after another when it scrolls into view
 * (needs the page to call `useReveal`). The full text is exposed as the accessible name and the
 * animated spans are hidden from assistive tech, so screen readers read the heading as one phrase.
 * Without the reveal hook (or with reduced motion) the words simply sit in place.
 */
export function SplitTitle({ as: Tag = 'h2', lines, className = '', id }: SplitTitleProps) {
  let index = 0
  const label = lines.map((line) => line.text).join(' ')

  return (
    <Tag id={id} className={`split-title ${className}`.trim()} aria-label={label} data-reveal>
      {lines.map((line) => (
        <span key={line.text} className={`split-line ${line.accent ? 'accent' : ''}`.trim()} aria-hidden="true">
          {line.text.split(' ').map((word, wordIndex) => (
            <span key={`${word}-${wordIndex}`}>
              {wordIndex > 0 ? ' ' : null}
              <span className="split-word">
                <span style={{ '--i': index++ } as CSSProperties}>{word}</span>
              </span>
            </span>
          ))}
        </span>
      ))}
    </Tag>
  )
}
