import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import CreateBlog from './components/CreateBlog'
import Message from './components/Message'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [errorMessage, setErrorMessage] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)

  const blogFormRef = useRef()

  const messageStyle = {
    borderRadius: 5,
    padding: 8,
    marginTop: 16,
    marginBottom: 16,
    width: 'max-content',
    fontSize: 20
  }

  const infoMessageStyle = {
    ...messageStyle,
    border: '2px solid #29A33B',
    color: '#29A33B'
  }

  const errorMessageStyle = {
    ...messageStyle,
    border: '2px solid #A32929',
    color: '#A32929'
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')

    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLoginSubmit = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedInUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      setInfoMessage('Successfully logged in')
      setTimeout(() => setInfoMessage(null), 3000)

    } catch(error) {
      console.log('error: ', error)

      setErrorMessage('The username or password you entered was incorrect')
      setTimeout(() => setErrorMessage(null), 5000)

    }
  }

  const handleLogout = () => {
    window.localStorage.clear()

    setUser(null)
    blogService.setToken(null)

    setInfoMessage('Successfully logged out')
    setTimeout(() => setInfoMessage(null), 3000)
  }

  const handleCreateBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()

      const blog = await blogService.create(blogObject)
      setBlogs(blogs.concat(blog))

      setInfoMessage(`The blog ${blog.title} by ${blog.author} was added`)
      setTimeout(() => setInfoMessage(null), 3000)

    } catch (exception) {
      setErrorMessage('Blog was not added')
      setTimeout(() => setErrorMessage(null), 3000)

    }
  }

  const handleUpdateBlog = async (updatedBlog) => {
    try {
      await blogService.update(updatedBlog.id, updatedBlog)
      await blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )
      setInfoMessage(`Blog ${updatedBlog.title} was updated`)
      setTimeout(() => setInfoMessage(null), 3000)
    } catch (exceptions) {
      setErrorMessage('Blog not updated')
      setTimeout(() => setErrorMessage(null), 3000)
    }
  }

  const handleDeleteBlog = async (id, title, author) => {
    if (window.confirm(`Remove blog ${title} by ${author}?`)) {
      try {
        await blogService.deleteObj(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
        setInfoMessage('Removed blog')
        setTimeout(() => setInfoMessage(null), 3000)
      } catch (exceptions) {
        setErrorMessage('Blog not deleted')
        setTimeout(() => setErrorMessage(null), 3000)
      }
    }
  }

  // Sorted in descending order of number of likes
  const blogsSortedByLikes = blogs.sort((a, b) => {
    if (a.likes > b.likes) {
      return -1
    }
    if (a.likes < b.likes) {
      return 1
    }
    return 0
  })

  return (
    <div>
      {!user
        ?
        <div>
          <h2>Login In To Application</h2>
          {errorMessage
          && <Message
            className="error"
            message={errorMessage}
            style={errorMessageStyle}
          />
          }
          {infoMessage
          && <Message
            message={infoMessage}
            style={infoMessageStyle}
          />
          }
          <form onSubmit={handleLoginSubmit}>
            <div>
              <label>
              Username
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={({ target }) => setUsername(target.value)}
                />
              </label>
            </div>
            <div>
              <label>
              Password
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={({ target }) => setPassword(target.value)}
                />
              </label>
            </div>
            <input id="login-button" type="submit" value="login" />
          </form>
        </div>
        :
        <div id="blogs">
          <h2>Blogs</h2>
          {errorMessage
          && <Message
            className="error"
            message={errorMessage}
            style={errorMessageStyle}
          />
          }
          {infoMessage
          && <Message
            message={infoMessage}
            style={infoMessageStyle}
          />
          }
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>Logout</button>
          <hr />
          <Togglable buttonLabel="Create New Blog" ref={blogFormRef}>
            <h2>Create New</h2>
            <CreateBlog handleCreateBlog={handleCreateBlog}/>
          </Togglable>
          <hr />
          {blogsSortedByLikes && blogsSortedByLikes.map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              userName={user.name}
              handleUpdateBlog={handleUpdateBlog}
              handleDeleteBlog={handleDeleteBlog}
            />
          )}
        </div>
      }
    </div>
  )
}

export default App