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

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const [errorMessage, setErrorMessage] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)

  const blogFormRef = useRef()

  // const [blogFormVisible, setBlogFormVisible] = useState(false)

  const messageStyle = {
    borderRadius: 5,
    padding: 8,
    marginTop: 16,
    marginBottom: 16,
    width: "max-content",
    fontSize: 20
  }

  const infoMessageStyle = {
    ...messageStyle,
    border: "2px solid #29A33B",
    color: "#29A33B"
  }

  const errorMessageStyle = {
    ...messageStyle,
    border: "2px solid #A32929",
    color: "#A32929"
  }

  // const showBlogFormWhenVisible = blogFormVisible ? { display: '' } : { display: 'none'}
  // const hideBlogFormWhenVisible = blogFormVisible ? { display: 'none' } : { display: ''}

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
    console.log('handleLoginSubmit start')
    try {
      const user = await loginService.login({username, password})
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

  const handleTitleChange = ({target}) => {
    setTitle(target.value)
  }

  const handleAuthorChange = ({target}) => {
    setAuthor(target.value)
  }

  const handleUrlChange = ({target}) => {
    setUrl(target.value)
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()
    const blog = await blogService.create({title, author, url})
    setBlogs(blogs.concat(blog))
    setTitle('')
    setAuthor('')
    setUrl('')
    blogFormRef.current.toggleVisibility()
    setInfoMessage(`The blog ${blog.title} by ${blog.author} was added`)
    setTimeout(() => setInfoMessage(null), 3000)
  }

  return (
    <div>
    {!user
    ? 
      <div>
        <h2>Login In To Application</h2>
        {errorMessage && <Message message={errorMessage} style={errorMessageStyle}/>}
        {infoMessage && <Message message={infoMessage} style={infoMessageStyle}/>}
        <form onSubmit={handleLoginSubmit}>
          <div>
            <label>
              Username
              <input
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
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <input type="submit" value="login" />
        </form>
      </div>
    : 
      <div>
        <h2>Blogs</h2>
        {errorMessage && <Message message={errorMessage} style={errorMessageStyle}/>}
        {infoMessage && <Message message={infoMessage} style={infoMessageStyle}/>}
        <p>{user.name} logged in</p>
        <button onClick={handleLogout}>Logout</button>
        <hr />
        <Togglable buttonLabel="Create New Blog" ref={blogFormRef}>
          <h2>Create New</h2>
          <CreateBlog 
            title={title}
            author={author}
            url={url}
            handleCreateBlog={handleCreateBlog}
            handleTitleChange={handleTitleChange}
              handleAuthorChange={handleAuthorChange}
            handleUrlChange={handleUrlChange}
          />
        </Togglable>
        <hr />
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>   
    }
  </div>
  )  
}

export default App