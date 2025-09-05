import { render, screen, fireEvent } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NewsModule } from '~/components/news-module'
import { toast } from 'sonner'

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}))

describe('NewsModule', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders heading and categories', () => {
    render(<NewsModule />)

    expect(screen.getByText(/Latest News/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /All/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Blockchain/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Bee News/i })
    ).toBeInTheDocument()
  })

  it('filters articles by category', () => {
    render(<NewsModule />)

    expect(
      screen.getByText(/Polygon Ecosystem Sees Massive Growth/i)
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Bee News/i }))

    expect(
      screen.getByText(/Revolutionary Bee Conservation/i)
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/Polygon Ecosystem Sees Massive Growth/i)
    ).not.toBeInTheDocument()
  })

  it('shows toast error when clicking unavailable article', () => {
    render(<NewsModule />)

    const beeArticle = screen.getByText(/Revolutionary Bee Conservation/i)
    fireEvent.click(beeArticle)

    expect(toast.error).toHaveBeenCalledWith(
      'This article page is not available yet 🚫'
    )
  })

  it('renders formatted date', () => {
    render(<NewsModule />)

    expect(screen.getAllByText(/days ago|Yesterday/i).length).toBeGreaterThan(0)
  })
})
