import React, { useState, useImperativeHandle } from 'react'

const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const showWhenVisible = visible ? { display: '' } : { display: 'none'}
  const hideWhenVisible = visible ? { display: 'none' } : { display: ''}

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })
  return (
    <div>
      <div style={showWhenVisible}>
        {props.children}
        <button type="button" onClick={toggleVisibility}>Cancel</button>
      </div>
      <div style={hideWhenVisible}>
        <button type="button" onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
    </div>
  )
})

export default Togglable