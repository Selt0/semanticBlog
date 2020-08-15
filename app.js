const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongoDB = require('./keys.js').mongoURI;
const app = express();

// connect to database
mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to DB!'))
  .catch((error) => console.error(error).message);

// configure app
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// configure database schema
const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now },
});

const Blog = mongoose.model('Blog', blogSchema);

// Blog.create(
//   {
//     title: 'Testing 1 2 3',
//     image:
//       'https://images.unsplash.com/photo-1597332631449-19e77016b782?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1600&q=60',
//     body: 'Hello! This is a blog post. Watch out for sharks!',
//   },
//   (err, post) => {
//     err ? console.error(err) : console.log(`${post.title} saved to DB!`);
//   }
// );

// RESTful routes
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

// index
app.get('/blogs', (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) return console.error(err);
    res.render('index', { blogs: blogs });
  });
});

// new
app.get('/blogs/new', (req, res) => {
  res.render('new');
});

// create
app.post('/blogs', (req, res) => {
  Blog.create(req.body.blog, (err, blog) => {
    if (err) return res.render('new');
    res.redirect('/blogs');
  });
});

// show
app.get('/blogs/:id', (req, res) => {
  Blog.findById(req.params.id, (err, blog) => {
    if (err) console.error(err.message);

    res.render('show', { blog: blog });
  });
});

app.listen(5000, () => {
  console.log('Server is live!');
});
