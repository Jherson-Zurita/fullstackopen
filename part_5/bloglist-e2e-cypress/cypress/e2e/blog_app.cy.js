const BACKEND_URL = 'http://localhost:3003/api'

describe('Blog app', () => {
  beforeEach(() => {
    cy.request('POST', `${BACKEND_URL}/testing/reset`)
    cy.request('POST', `${BACKEND_URL}/users`, {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    })
    cy.request('POST', `${BACKEND_URL}/users`, {
      name: 'Arto Hellas',
      username: 'artohellas',
      password: 'salasana'
    })
    cy.visit('/')
  })

  // 5.24: navegación por rutas
  it('shows the blog list at root', () => {
    cy.get('h1').should('contain', 'Blog app')
    cy.get('a').contains('login').should('be.visible')
  })

  it('shows the login form at /login', () => {
    cy.visit('/login')
    cy.contains('Log in to application')
    cy.get('[data-testid="username"]').should('be.visible')
    cy.get('[data-testid="password"]').should('be.visible')
  })

  it('shows the logout button in the nav when logged in, and redirects to root on logout', () => {
    cy.login({ username: 'mluukkai', password: 'salainen' })
    cy.contains('Matti Luukkainen logged in')

    cy.contains('logout').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.contains('login')
  })

  describe('When logged in', () => {
    beforeEach(() => {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    // 5.25 / 5.27: vista de un solo blog
    it('a single blog view shows its details', () => {
      cy.createBlog({
        title: 'Blog with its own view',
        author: 'Someone',
        url: 'https://example.com'
      })

      cy.contains('Blog with its own view').click()
      cy.contains('https://example.com')
      cy.contains('likes 0')
    })

    it('a logged in user (non-creator) sees only the like button on a blog view', () => {
      cy.createBlog({
        title: 'Blog by mluukkai',
        author: 'Matti',
        url: 'https://example.com/mluukkai'
      })

      cy.contains('logout').click()
      cy.login({ username: 'artohellas', password: 'salasana' })

      cy.contains('Blog by mluukkai').click()
      cy.get('button').contains('like').should('be.visible')
      cy.get('button').contains('remove').should('not.exist')
    })

    it('the creator sees both the like and the remove button on a blog view', () => {
      cy.createBlog({
        title: 'Blog with remove button',
        author: 'Matti',
        url: 'https://example.com/remove'
      })

      cy.contains('Blog with remove button').click()
      cy.get('button').contains('like').should('be.visible')
      cy.get('button').contains('remove').should('be.visible')
    })

    it('a logged in user can like a blog from its own view', () => {
      cy.createBlog({
        title: 'Blog to like from its view',
        author: 'Someone',
        url: 'https://example.com/like'
      })

      cy.contains('Blog to like from its view').click()
      cy.contains('likes 0')
      cy.get('button').contains('like').click()
      cy.contains('likes 1')
    })

    // 5.26: vista para crear un blog, con redirección tras crear/eliminar
    it('a new blog can be created from its own view and redirects to the blog list', () => {
      cy.contains('create new blog').click()
      cy.url().should('include', '/blogs/new')

      cy.get('button').contains('create new blog').click()
      cy.get('[data-testid="title"]').type('Created from its own route')
      cy.get('[data-testid="author"]').type('Route Author')
      cy.get('[data-testid="url"]').type('https://example.com/route')
      cy.get('button').contains('create').click()

      cy.contains('a new blog "Created from its own route" by Route Author added')
      cy.url().should('eq', Cypress.config().baseUrl + '/')
      cy.contains('Created from its own route')
    })

    it('deleting a blog redirects to the blog list', () => {
      cy.createBlog({
        title: 'Blog that will be deleted',
        author: 'Someone',
        url: 'https://example.com/delete'
      })

      cy.contains('Blog that will be deleted').click()
      cy.url().should('include', '/blogs/')

      cy.on('window:confirm', () => true)
      cy.get('button').contains('remove').click()

      cy.url().should('eq', Cypress.config().baseUrl + '/')
      cy.contains('Blog that will be deleted').should('not.exist')
    })
  })
})
