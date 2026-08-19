import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'
import Blog from '../src/components/Blog'

const testBlog = {
  id: '1',
  title: 'Component testing is done with react-testing-library',
  author: 'Kent C. Dodds',
  url: 'https://kentcdodds.com/blog/testing',
  likes: 5,
  user: { id: 'u1', username: 'kentcdodds', name: 'Kent C. Dodds' }
}

const loggedInUser = { username: 'kentcdodds', name: 'Kent C. Dodds' }

// Blog usa react-router-dom (<Link>), así que las pruebas necesitan un Router alrededor
const renderBlog = (props) =>
  render(
    <MemoryRouter>
      <Blog {...props} />
    </MemoryRouter>
  )

describe('<Blog />', () => {
  // 5.13: muestra título y autor, pero no url ni likes por defecto
  test('renders title and author, but not url or likes by default', () => {
    renderBlog({ blog: testBlog, user: loggedInUser })

    expect(
      screen.getByText(/Component testing is done with react-testing-library/)
    ).toBeInTheDocument()
    expect(screen.getByText(/Kent C. Dodds/)).toBeInTheDocument()

    expect(screen.queryByText(testBlog.url)).not.toBeInTheDocument()
    expect(screen.queryByText(`likes ${testBlog.likes}`)).not.toBeInTheDocument()
  })

  // 5.14: al hacer clic en el botón "view", se muestran url y likes
  test('shows url and likes when the view button is clicked', async () => {
    const user = userEvent.setup()
    renderBlog({ blog: testBlog, user: loggedInUser, onLike: vi.fn(), onDelete: vi.fn() })

    const button = screen.getByText('view')
    await user.click(button)

    expect(screen.getByText(testBlog.url)).toBeInTheDocument()
    expect(screen.getByText(`likes ${testBlog.likes}`)).toBeInTheDocument()
  })

  // 5.15: si el botón like se pulsa dos veces, el handler se llama dos veces
  test('calls the like handler twice when the like button is clicked twice', async () => {
    const user = userEvent.setup()
    const mockHandler = vi.fn()

    renderBlog({
      blog: testBlog,
      user: loggedInUser,
      onLike: mockHandler,
      onDelete: vi.fn()
    })

    // primero hay que expandir los detalles para que el botón "like" exista
    await user.click(screen.getByText('view'))

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler).toHaveBeenCalledTimes(2)
  })
})
