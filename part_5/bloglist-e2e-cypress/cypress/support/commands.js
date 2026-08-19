const BACKEND_URL = 'http://localhost:3003/api'

// inicia sesión rápidamente vía API en lugar de rellenar el formulario cada vez
Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', `${BACKEND_URL}/login`, { username, password }).then(
    ({ body }) => {
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(body))
      cy.visit('/')
    }
  )
})

// crea un blog directamente vía API, usando el token del usuario logueado en localStorage
Cypress.Commands.add('createBlog', (blog) => {
  const loggedUser = JSON.parse(window.localStorage.getItem('loggedBlogAppUser'))

  cy.request({
    url: `${BACKEND_URL}/blogs`,
    method: 'POST',
    body: blog,
    headers: { Authorization: `Bearer ${loggedUser.token}` }
  })

  cy.visit('/')
})
