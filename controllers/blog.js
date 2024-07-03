const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (blog) {
      response.json(blog);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body;
  const user = await request.user;

  if (!body.title || !body.url) {
    return response.status(400).send({ error: 'Title or URL missing' });
  }
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  try {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const user = await request.user;
    const updatedBlogs = user.blogs.filter(
      (blog) => blog.toString() !== request.params.id,
    );

    const blog = await Blog.findById(request.params.id);

    if (blog.user.toString() !== user.id.toString()) {
      return response
        .status(401)
        .json({ error: 'You are not alowed to do that' });
    } else {
      user.blogs = updatedBlogs;
      await user.save();
      await Blog.findByIdAndDelete(request.params.id);
      response.status(204).end();
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.put('/:id', async (request, response, next) => {
  const update = request.body;
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      update,
      {
        new: true,
      },
    );
    if (!updatedBlog) {
      return response.status(404).send({ error: 'Blog not found' });
    }
    response.status(200).json(updatedBlog);
  } catch (exception) {
    next(exception);
  }
});

module.exports = blogsRouter;
