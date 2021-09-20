import React from 'react'

const Message = ({ message, style, className = '' }) => {
  return (
    <div style={style} className={className}>{message}</div>
  )
}

export default Message