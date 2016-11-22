"use strict";
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: './public/images' });
const mongo = require('mongodb');
const db = require('monk')('localhost/nodeblog');

/* GET users listing. */
router.get('/add', function(req, res, next) {
  const post = db.get('categories');

  categories.find({},{}, (err, categories)=>{
      res.render('addpost', {
    'title': 'Add Post',
    'categories': categories
  });
  });
  
});

// Show specific post
router.get('/show/:id', function(req, res, next) {
  let posts = db.get('posts');

  posts.findById(req.params.id, (err, post)=>{
      res.render('show', {
     'post': post
  });
  });
  
});

router.post('/add', upload.single('mainImage'), function(req, res, next) {
  // Get the form values
  const title = req.body.title;
  const category = req.body.category;
  const body = req.body.body;
  const author = req.body.author;
  const date = new Date();
  const mainImage = req.file ? req.file.filename : 'noimage.jpg'

  //Form Validation
  req.checkBody('title', "Title field is required").notEmpty();
  req.checkBody('body', 'Body field is required').notEmpty();

  // Check errors
  const errors = req.validationErrors();

  if (errors) {
    console.log('erring')
    res.render('addpost', {
      'error': errors
    });
  } else {
    // POST to MongoDB
    console.log('posting');
    let posts = db.get('posts');
    const payload = { title, body, category, date, author, mainImage };
    posts.insert( payload, (err, post) => {
      if(err) {
        res.send(err);
      } else {
        req.flash('success', 'Post Added');
        res.location('/');
        res.redirect('/');
      }
    });
  }
});

// Add Comment via Post to Post by ID
router.post('/addComment', function(req, res, next) {
  // Get the form values
  const name = req.body.name;
  const email = req.body.email;
  const comment = req.body.comment;
  const postId = req.body.postId;
  const commentDate = new Date();

  //Form Validation
  req.checkBody('name', "Name field is required").notEmpty();
  req.checkBody('email', "Email field is required, but not public").notEmpty();
    req.checkBody('email', "Email is not a valid format").isEmail();
  req.checkBody('comment', 'Comment field is required').notEmpty();

  // Check errors
  const errors = req.validationErrors();

  if (errors) {
    let posts = db.get('posts');

    posts.findById(postId, (err, post) => {
      res.render('show', {
        'error': errors,
        'post': post
      });
    });
  } else {
    const commentPayload = { name, email, comment, commentDate };
    
    let posts = db.get('posts');
    
    posts.update({
      "_id": postId
    }, {
      $push: {
        "comments": commentPayload
      }
    }, function(err, doc){
        if(err) {
          throw err;
        } else {
          req.flash('success', 'Comment Added')
          res.location('/posts/show/' + postId);
          res.redirect('/posts/show/' + postId);
        }
    });
  }
});

module.exports = router;
