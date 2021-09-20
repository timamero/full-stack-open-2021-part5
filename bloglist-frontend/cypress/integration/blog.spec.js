describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')

    const user = {
      name: 'Admin',
      username: 'admin',
      password: 'adminsecret'
    }
    cy.request('POST', 'http://localhost:3001/api/users', user)

    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Login In To Application')
    cy.get('#username')
    cy.get('#password')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('admin')
      cy.get('#password').type('adminsecret')
      cy.get('#login-button').click()

      cy.contains('Admin logged in')
    })

    it('fails with credentials', function() {
      cy.get('#username').type('admin')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error').should('contain', 'The username or password you entered was incorrect')
      cy.get('.error').should('have.css', 'color', 'rgb(163, 41, 41)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3001/api/login/', { username: 'admin', password: 'adminsecret' })
        .then(response => {
          localStorage.setItem('loggedInUser', JSON.stringify(response.body))
        })
      cy.visit('http://localhost:3000')
    })
    it('A blog can be created', function() {
      cy.contains('Create New Blog').click()
      cy.get('#title').type('new title')
      cy.get('#author').type('new author')
      cy.get('#url').type('new@blog.com')
      cy.get('#create-blog-button').click()

      cy.get('#blog-list').contains('new title')
    })
  })
})