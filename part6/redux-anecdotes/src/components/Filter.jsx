import { setFilter } from "../reducers/filterReducer.js"
import { useDispatch } from "react-redux"

const Filter = () => {
    const dispatch = useDispatch()

    const handleChange = e => {
        dispatch(setFilter(e.target.value))
    }
    const style = {
        marginBotton: 10
    }

    return (
        <div style={style}>
            filter <input onChange={handleChange} />
        </div>
    )
}

export default Filter