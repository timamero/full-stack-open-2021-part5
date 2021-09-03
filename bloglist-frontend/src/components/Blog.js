import React, { useState } from 'react'

const Blog = ({blog, handleUpdateBlog}) => {
  const [likes, setLikes] = useState(blog.likes)
  const [detailsVisible, setDetailsVisible] = useState(false)

  const blogStyle = {
    border: '1px solid black',
    borderRadius: '0.2rem',
    margin: '1rem 0',
    padding: '0.5rem'
  }

  const detailsStyle = detailsVisible ? { display: ''} : {display: 'none'}
  const buttonLabel = detailsVisible ? 'Hide' : 'View'

  const handleViewClick = () => {
    setDetailsVisible(!detailsVisible)
  }

  const handleLikeClick = () => {
    const updatedLikes = likes + 1
    const updatedBlog = {...blog, likes: updatedLikes}
    
    handleUpdateBlog(updatedBlog)
    setLikes(updatedLikes)
  }
  
  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} {' '}
        <button type="button" onClick={handleViewClick}>{buttonLabel}</button>
      </div>
      <div style={detailsStyle}>
        <p>{blog.url}</p>
        <div>
          likes: {likes} {' '}
          <button type="button" onClick={handleLikeClick}>Like</button>
        </div>
        <p>{blog.user.name}</p>
      </div>
    </div>
)}

export default Blog