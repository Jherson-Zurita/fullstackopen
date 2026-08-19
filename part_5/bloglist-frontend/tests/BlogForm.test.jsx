import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'
import BlogForm from '../src/components/BlogForm'

describe('<BlogForm />', () => {
  test('calls the event handler it received as props with the right details when a new blog is created', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()

    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByTestId('title')
    const authorInput = screen.getByTestId('author')
    const urlInput = screen.getByTestId('url')
    const sendButton = screen.getByText('create')

    await user.type(titleInput, 'Testing React apps')
    await user.type(authorInput, 'Kent C. Dodds')
    await user.type(urlInput, 'https://kentcdodds.com')
    await user.click(sendButton)

    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog).toHaveBeenCalledWith({
      title: 'Testing React apps',
      author: 'Kent C. Dodds',
      url: 'https://kentcdodds.com'
    })
  })
})
