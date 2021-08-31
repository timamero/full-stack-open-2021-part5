import React from 'react'

const CreateBlog = ({title, author, url, handleCreateBlog, handleTitleChange, handleAuthorChange, handleUrlChange}) => {

  return (
    <form onSubmit={handleCreateBlog}>
      <div>
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
          />
        </label>
      </div>
      <div>
        <label>
          Author
          <input
            type="text"
            value={author}
            onChange={handleAuthorChange}
          />
        </label>
      </div>
      <div>
        <label>
          URL
          <input
            type="text"
            value={url}
            onChange={handleUrlChange}
          />
        </label>
      </div>
      <input type="submit" value="Create" />
    </form>
  )
}

export default CreateBlog