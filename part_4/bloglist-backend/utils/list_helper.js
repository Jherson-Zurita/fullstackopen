const _ = require('lodash')

// 4.3: siempre devuelve 1
// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

// 4.4: suma total de likes
const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

// 4.5*: el blog con más likes
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return undefined
  }

  const favorite = blogs.reduce((best, blog) => (blog.likes > best.likes ? blog : best))

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

// 4.6*: el autor con más blogs (usando lodash)
const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return undefined
  }

  const grouped = _.groupBy(blogs, 'author')
  const counts = Object.entries(grouped).map(([author, authorBlogs]) => ({
    author,
    blogs: authorBlogs.length
  }))

  return _.maxBy(counts, 'blogs')
}

// 4.7*: el autor con más likes en total
const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return undefined
  }

  const grouped = _.groupBy(blogs, 'author')
  const likesByAuthor = Object.entries(grouped).map(([author, authorBlogs]) => ({
    author,
    likes: authorBlogs.reduce((sum, blog) => sum + blog.likes, 0)
  }))

  return _.maxBy(likesByAuthor, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
