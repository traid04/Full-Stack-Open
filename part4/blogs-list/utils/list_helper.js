const dummy = blogs => {
    return 1
}

const totalLikes = blogs => {
    return blogs.reduce((sum, blog) =>  sum + blog.likes, 0)
}

const favoriteBlog = blogs => {
    if (blogs.length === 0) {
        return null
    }
    let maxIndex = 0
    let maxLikes = 0
    blogs.forEach((blog, index) => {
        if (blog.likes > maxLikes) {
            maxIndex = index
            maxLikes = blog.likes
        }
    })
    const favorite = {
        title: blogs[maxIndex].title,
        author: blogs[maxIndex].author,
        likes: blogs[maxIndex].likes
    }
    return favorite
}

const mostBlogs = blogs => {
  if (blogs.length === 0) {
    return null
  }
  const authors = blogs.reduce((list, blog) => {
    if (!list[blog.author]) {
      list[blog.author] = 1
    }
    else {
      list[blog.author]++
    }
    return list
  }, {})
  let maxAuthor = null
  let maxBlogs = 0
  Object.entries(authors).forEach(author => {
    if (author[1] > maxBlogs) {
      maxAuthor = author[0]
      maxBlogs = author[1]
    }
  })
  return({author: maxAuthor, blogs: maxBlogs})
}

const mostLikes = blogs => {
  if (blogs.length === 0) {
    return null
  }
  const authors = blogs.reduce((list, blog) => {
    if (list[blog.author]) {
      list[blog.author] += blog.likes
    }
    else {
      list[blog.author] = blog.likes
    }
    return list
  }, {})
  let mostPopular = null
  let likes = 0
  Object.entries(authors).forEach(author => {
    if (author[1] > likes) {
      mostPopular = author[0]
      likes = author[1]
    }
  })
  return {author: mostPopular, likes}
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}