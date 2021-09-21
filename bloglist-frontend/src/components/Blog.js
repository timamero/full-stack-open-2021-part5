import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, userName, handleUpdateBlog, handleDeleteBlog }) => {
  const [likes, setLikes] = useState(blog.likes)
  const [detailsVisible, setDetailsVisible] = useState(false)

  const blogStyle = {
    border: '1px solid black',
    borderRadius: '0.2rem',
    margin: '1rem 0',
    padding: '0.5rem'
  }

  const deleteButtonStyle = {
    cursor: 'pointer',
    borderRadius: '0.2rem',
    backgroundColor: '#A30000',
    color: '#FFF',
    outline: 'none',
    border: 'none'
  }

  const detailsStyle = detailsVisible ? { display: '' } : { display: 'none' }
  const buttonLabel = detailsVisible ? 'Hide' : 'View'

  const handleViewClick = () => {
    setDetailsVisible(!detailsVisible)
  }

  const handleLikeClick = () => {
    const updatedLikes = likes + 1
    const updatedBlog = { ...blog, likes: updatedLikes }

    handleUpdateBlog(updatedBlog)
    setLikes(updatedLikes)
  }

  const handleDeleteClick = () => {
    handleDeleteBlog(blog.id, blog.title, blog.author)
  }


  return (
    <div className="blog" style={blogStyle}>
      <div className="visibleDiv">
        {blog.title} {blog.author} {' '}
        <button type="button" onClick={handleViewClick}>{buttonLabel}</button>
      </div>
      <div style={detailsStyle} className="toggleableDiv">
        <p>{blog.url}</p>
        <div>
          <span className="likes">likes: {likes}</span>{' '}
          <button type="button" onClick={handleLikeClick}>Like</button>
        </div>
        <p>{blog.user.name}</p>
        {blog.user.name === userName && <button style={deleteButtonStyle} type="button" onClick={handleDeleteClick}>Remove</button>}
      </div>
    </div>
  )}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  userName: PropTypes.string.isRequired,
  handleUpdateBlog: PropTypes.func.isRequired,
  handleDeleteBlog: PropTypes.func.isRequired
}

export default Blog