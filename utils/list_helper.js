const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (posts) => {
  return posts.length === 0
    ? 0
    : posts.reduce((sum, acc) => sum + acc.likes, 0);
};

const favoriteBlog = (blogs) => {
  const postWithMostLikes = blogs.reduce(
    (max, blog) => (blog.likes > max.likes ? blog : max),
    blogs[0]
  );

  return !postWithMostLikes
    ? 0
    : {
        title: postWithMostLikes.title,
        author: postWithMostLikes.author,
        likes: postWithMostLikes.likes,
      };
};

const mostBlogs = (blogs) => {
  const authorCounts = _.countBy(blogs, "author");
  const arrayAuthors = Object.keys(authorCounts).map((key) => ({
    author: key,
    blogs: authorCounts[key],
  }));
  const authorWhitMostPosts = arrayAuthors.reduce(
    (max, author) => (author.blogs > max.blogs ? author : max),
    arrayAuthors[0]
  );
  return !authorWhitMostPosts ? 0 : authorWhitMostPosts;
};

const mostLikes = (blogs) => {
  let newArray = [];
  blogs.forEach((blog) => {
    const authorEntry = newArray.find((entry) => entry.author === blog.author);
    if (authorEntry) {
      authorEntry.likes += blog.likes;
    } else {
      newArray.push({
        author: blog.author,
        likes: blog.likes,
      });
    }
  });

  const authorWithMostLikes = newArray.reduce(
    (max, author) => (author.likes > max.likes ? author : max),
    newArray[0]
  );

  return !authorWithMostLikes ? 0 : authorWithMostLikes;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
