const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // 5.18: vacía la base de datos y crea un usuario antes de cada prueba
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Arto Hellas',
        username: 'artohellas',
        password: 'salasana'
      }
    })

    await page.goto('/')
  })

  // 5.17
  test('Login form is shown', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'Log in to application' })).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
  })

  // 5.18
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.goto('/login')
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.goto('/login')
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.goto('/login')
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    // 5.19
    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('link', { name: 'create new blog' }).click()
      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.getByTestId('title').fill('Playwright End to End Testing')
      await page.getByTestId('author').fill('Microsoft')
      await page.getByTestId('url').fill('https://playwright.dev')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(
        page.getByText('a new blog "Playwright End to End Testing" by Microsoft added')
      ).toBeVisible()

      await page.goto('/')
      await expect(page.getByText('Playwright End to End Testing')).toBeVisible()
    })

    // 5.20
    test('a blog can be edited (liked)', async ({ page }) => {
      await page.getByRole('link', { name: 'create new blog' }).click()
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByTestId('title').fill('Blog to like')
      await page.getByTestId('author').fill('Some Author')
      await page.getByTestId('url').fill('https://example.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.goto('/')
      const blogRow = page.locator('.blog', { hasText: 'Blog to like' })
      await blogRow.getByRole('button', { name: 'view' }).click()
      await expect(blogRow.getByText('likes 0')).toBeVisible()

      await blogRow.getByRole('button', { name: 'like' }).click()
      await expect(blogRow.getByText('likes 1')).toBeVisible()
    })

    // 5.21
    test('the creator can delete their own blog', async ({ page }) => {
      await page.getByRole('link', { name: 'create new blog' }).click()
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByTestId('title').fill('Blog to delete')
      await page.getByTestId('author').fill('Deletable Author')
      await page.getByTestId('url').fill('https://example.com/delete')
      await page.getByRole('button', { name: 'create' }).click()

      await page.goto('/')
      const blogRow = page.locator('.blog', { hasText: 'Blog to delete' })
      await blogRow.getByRole('button', { name: 'view' }).click()

      page.once('dialog', (dialog) => dialog.accept())
      await blogRow.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('Blog to delete')).not.toBeVisible()
    })

    // 5.22
    test('only the creator sees the delete button', async ({ page, request }) => {
      await page.getByRole('link', { name: 'create new blog' }).click()
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByTestId('title').fill('Only creator can delete')
      await page.getByTestId('author').fill('Owner')
      await page.getByTestId('url').fill('https://example.com/owner')
      await page.getByRole('button', { name: 'create' }).click()

      await page.goto('/')
      let blogRow = page.locator('.blog', { hasText: 'Only creator can delete' })
      await blogRow.getByRole('button', { name: 'view' }).click()
      await expect(blogRow.getByRole('button', { name: 'remove' })).toBeVisible()

      // cerrar sesión e iniciar sesión con otro usuario
      await page.getByRole('button', { name: 'logout' }).click()
      await page.goto('/login')
      await page.getByTestId('username').fill('artohellas')
      await page.getByTestId('password').fill('salasana')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Arto Hellas logged in')).toBeVisible()

      await page.goto('/')
      blogRow = page.locator('.blog', { hasText: 'Only creator can delete' })
      await blogRow.getByRole('button', { name: 'view' }).click()
      await expect(blogRow.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })
  })

  // 5.23
  test('blogs are ordered by likes, most liked first', async ({ page, request }) => {
    await page.goto('/login')
    await page.getByTestId('username').fill('mluukkai')
    await page.getByTestId('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()

    const blogsToCreate = [
      { title: 'Low likes blog', author: 'A', url: 'https://a.com', likes: 1 },
      { title: 'High likes blog', author: 'B', url: 'https://b.com', likes: 5 },
      { title: 'Medium likes blog', author: 'C', url: 'https://c.com', likes: 3 }
    ]

    for (const blog of blogsToCreate) {
      await page.getByRole('link', { name: 'create new blog' }).click()
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByTestId('title').fill(blog.title)
      await page.getByTestId('author').fill(blog.author)
      await page.getByTestId('url').fill(blog.url)
      await page.getByRole('button', { name: 'create' }).click()
      await page.goto('/')

      const blogRow = page.locator('.blog', { hasText: blog.title })
      await blogRow.getByRole('button', { name: 'view' }).click()
      for (let i = 0; i < blog.likes; i++) {
        await blogRow.getByRole('button', { name: 'like' }).click()
        await expect(blogRow.getByText(`likes ${i + 1}`)).toBeVisible()
      }
    }

    await page.reload()
    const blogTitles = await page.locator('.blogSummary a').allTextContents()

    const highIndex = blogTitles.indexOf('High likes blog')
    const mediumIndex = blogTitles.indexOf('Medium likes blog')
    const lowIndex = blogTitles.indexOf('Low likes blog')

    expect(highIndex).toBeLessThan(mediumIndex)
    expect(mediumIndex).toBeLessThan(lowIndex)
  })
})
