import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    console.log('submit login')

    try {
      const loggedInUser = await loginService.login({username, password})
      setUser(loggedInUser)
      console.log('logged in user')
    } catch(error) {
      console.log('error: ', error)
    }
  }

  return (
    <div>
    {!user
    ? 
      <div>
        <h2>Login In To Application</h2>
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
                type="text"
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
        <p>{user.name} logged in</p>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>   
    }
  </div>
  )  
}

export default App