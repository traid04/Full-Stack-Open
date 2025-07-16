import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs.js'

const initialState = []

const blogsSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {
        setBlogs(state, action) {
            return action.payload.sort((a,b) => b.likes - a.likes)
        },
        createBlog(state, action) {
            state.push(action.payload)
            state.sort((a,b) => b.likes - a.likes)
        },
        setLikes(state, action) {
            state.forEach(blog => {
                if (blog.id === action.payload.id) {
                    blog.likes += 1
                }
            })
            return state
        }
    }
})

export const { setBlogs, createBlog, setLikes } = blogsSlice.actions
export default blogsSlice.reducer

export const initializeBlogs = token => {
    return async dispatch => {
        blogService.setToken(token)
        const result = await blogService.getAll()
        dispatch(setBlogs(result))
    }
}

export const plusLike = blog => {
    return async dispatch => {
        try {
          const response = await blogService.update(blog)
          dispatch(setLikes(response))
        }
        catch(error) {
          console.log(error)
        }
    }
}