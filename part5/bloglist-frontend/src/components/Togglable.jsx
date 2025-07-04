import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef(({ children, buttonLabel, hideLabel }, refs) => {
  const [visible, setVisible] = useState(false)
  const toggle = () => {
    setVisible(!visible)
  }
  useImperativeHandle(refs, () => {
    return {
      toggle
    }
  })
  return (
    <div>
      {visible
        ?(
          <div className='show-content'>
            {children}
            <button onClick={() => toggle()}>{hideLabel}</button>
          </div>
        )
        :
        <button onClick={() => toggle()}>{buttonLabel}</button>
      }
    </div>
  )
})

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  hideLabel: PropTypes.string.isRequired
}

export default Togglable