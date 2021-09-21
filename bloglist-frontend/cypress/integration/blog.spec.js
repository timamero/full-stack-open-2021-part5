describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')

    const user = {
      name: 'Admin',
      username: 'admin',
      password: 'adminsecret'
    }
    cy.request('POST', 'http://localhost:3001/api/users', user)

    const otherUser = {
      name: 'OtherUser',
      username: 'otherUser',
      password: 'othersecret'
    }
    cy.request('POST', 'http://localhost:3001/api/users', otherUser)

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

      cy.get('#blogs').contains('new title')
    })

    describe('Several blogs by same user exists', function() {
      beforeEach(function() {
        const blog1 = {
          title: 'test title 1',
          author: 'test author',
          url: 'test1@example.com'
        }
        const blog2 = {
          title: 'test title 2',
          author: 'test author',
          url: 'test2@example.com'
        }
        const blog3 = {
          title: 'test title 3',
          author: 'test author',
          url: 'test3@example.com'
        }
        cy.request({
          url: 'http://localhost:3001/api/blogs',
          method: 'POST',
          body: blog1,
          headers: {
            'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedInUser')).token}`
          }
        })
        cy.request({
          url: 'http://localhost:3001/api/blogs',
          method: 'POST',
          body: blog2,
          headers: {
            'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedInUser')).token}`
          }
        })
        cy.request({
          url: 'http://localhost:3001/api/blogs',
          method: 'POST',
          body: blog3,
          headers: {
            'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedInUser')).token}`
          }
        })

        cy.visit('http://localhost:3000')
      })

      it.only('User can like a blog', function() {
        cy.get('#blogs').contains('test title 2')
          .contains('View')
          .click()

        cy.get('#blogs').contains('test title 2')
          .parent()
          .contains('likes: 0')

        cy.get('#blogs').contains('test title 2')
          .parent()
          .contains('Like')
          .click()

        cy.get('#blogs').contains('test title 2')
          .parent()
          .contains('likes: 1')
      })

      it('User who created blog can delete blog', function() {
        cy.get('#blogs').contains('test title 2')
          .contains('View')
          .click()

        cy.get('#blogs').contains('test title 2')
          .parent()
          .contains('Remove')
          .click()

        cy.get('#blogs').should('not.contain', 'test title 2')
      })

      it('User who did not create blog cannot delete blog', function() {
        localStorage.removeItem('loggedInUser')
        cy.request('POST', 'http://localhost:3001/api/login/', { username: 'otherUser', password: 'othersecret' })
          .then(response => {
            localStorage.setItem('loggedInUser', JSON.stringify(response.body))
          })
        cy.visit('http://localhost:3000')

        cy.get('#blogs').contains('test title 2')
          .contains('View')
          .click()

        cy.get('#blogs').contains('test title 2')
          .parent()
          .should('not.contain', 'Remove')
      })

      it('blogs are ordered according to likes with most likes first', function() {

      })
    })
  })
})