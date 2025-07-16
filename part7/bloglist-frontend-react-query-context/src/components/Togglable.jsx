import { Button } from 'react-bootstrap'
import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef(({ children, buttonLabel, hideLabel }, refs) => {
    const [visible, setVisible] = useState(false)
    const toggle = () => {
        setVisible(!visible)
    }
    useImperativeHandle(refs, () => {
        return {
            toggle,
        }
    })
    return (
        <div>
            {visible ? (
                <div className="show-content">
                    {children}
                    <Button variant="danger" onClick={() => toggle()}>
                        cancel
                    </Button>
                </div>
            ) : (
                <Button variant="success" onClick={() => toggle()}>
                    {buttonLabel}
                </Button>
            )}
        </div>
    )
})

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired,
    hideLabel: PropTypes.string.isRequired,
}

export default Togglable
