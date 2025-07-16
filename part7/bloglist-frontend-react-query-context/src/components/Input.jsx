const Input = ({ text, type, name, actualValue, onChange }) => {
    return (
        <div>
            {text}{' '}
            <input
                type={type}
                name={name}
                value={actualValue}
                onChange={onChange}
                placeholder={name}
            />
        </div>
    )
}

export default Input
