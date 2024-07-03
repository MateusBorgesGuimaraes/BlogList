const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'João e o pé de feijão',
    author: 'Benjamin Tabart',
    url: 'www.testtest.com',
    likes: 24,
  },
  {
    title: 'Chapeuzinho vermelho',
    author: 'Perrault ',
    url: 'www.testtest2.com',
    likes: 35,
  },
];

const haveLikeOrNot = [
  {
    title: 'Alibaba e os 40 ladroes',
    author: 'Joai Uind',
    url: 'www.testtest.com',
  },
  {
    title: 'Branca de Neve',
    author: 'Lamja ',
    url: 'www.testtest2.com',
    likes: 35,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

// TEST 1
test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

// TEST 2
test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(initialBlogs.length);
});

// TEST 3
test('Blogs have _id', async () => {
  const response = await api.get('/api/blogs');
  const ids = response.body.map((blog) => blog.id);
  expect(ids).toHaveLength(initialBlogs.length);
});

// TEST 4
test('Blog are correctly added(must be 3)', async () => {
  await api
    .post('/api/blogs')
    .send({
      title: 'Teste no teste',
      author: 'Author do Teste no teste',
      url: 'www.testenoteste.com',
      likes: 45,
    })
    .expect(201);

  const response2 = await api.get('/api/blogs');
  expect(response2.body).toHaveLength(initialBlogs.length + 1);
});

// TEST 5
test('Blog has Like? if doesnt set it to 0', async () => {
  let validBlog = function (res) {
    const ok = res.body.hasOwnProperty('likes');
    if (!ok) res.body.likes = 0;
  };
  const response = await api
    .post('/api/blogs')
    .send({
      title: 'Alibaba e os 40 ladroes',
      author: 'Joai Uind',
      url: 'www.testtest.com',
    })
    .expect(201)
    .expect(validBlog);

  // console.log('response', response.body);
});

test('Blog has title or url? if doesnt return erro 404', async () => {
  const response = await api
    .post('/api/blogs')
    .send({
      // title: 'Alibaba e os 40 ladroes',
      author: 'Joai Uind',
      url: 'www.testtest.com',
      likes: 33,
    })
    .expect(400);
});

test('the first blog title is Post do test1', async () => {
  const response = await api.get('/api/blogs');

  const titles = response.body.map((r) => r.title);
  expect(titles).toContain('Chapeuzinho vermelho');
});

afterAll(async () => {
  await mongoose.connection.close();
});
