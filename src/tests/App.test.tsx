import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import App from '../app/App'

describe('IKASLÉ site', () => {
  it('renders the home hero and primary navigation', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )
    expect(await screen.findByRole('heading', { name: /we create impact/i }, { timeout: 8000 })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: /primary navigation/i })).toBeInTheDocument()
  })

  it('renders the portfolio route via /portfolio slug', async () => {
    render(
      <MemoryRouter initialEntries={['/portfolio']}>
        <App />
      </MemoryRouter>,
    )
    expect(await screen.findByRole('heading', { level: 1, name: /frames that move/i }, { timeout: 8000 })).toBeInTheDocument()
  })

  it('renders the not found route', async () => {
    render(
      <MemoryRouter initialEntries={['/missing-frame']}>
        <App />
      </MemoryRouter>,
    )
    expect(await screen.findByRole('heading', { name: /final cut/i }, { timeout: 8000 })).toBeInTheDocument()
  })
})

