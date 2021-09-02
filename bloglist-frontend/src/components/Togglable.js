import React, { useState } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const showWhenVisible = visible ? { display: '' } : { display: 'none'}
  const hideWhenVisible = visible ? { display: 'none' } : { display: ''}
  return (
    <div>
      <div style={showWhenVisible}>
        {props.children}
        <button type="button" onClick={() => setVisible(false)}>Cancel</button>
      </div>
      <div style={hideWhenVisible}>
        <button type="button" onClick={() => setVisible(true)}>{props.buttonLabel}</button>
      </div>
    </div>
  )
}

export default Togglable