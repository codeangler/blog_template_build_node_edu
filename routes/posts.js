"use strict";
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const mongo = require('mongodb');
const db = require('monk')('localhost/nodeblog');

/* GET users listing. */
router.get('/add', function(req, res, next) {
  const categories = db.get('categories');

  categories.find({},{}, (err, categories)=>{
      res.render('addpost', {
    'title': 'Add Post',
    'categories': categories
  });
  });
  
});

router.post('/add', upload.single('mainimage'), function(req, res, next) {
  // Get the form values
  const title = req.body.title;
  const category = req.body.category;
  const body = req.body.body;
  const author = req.body.author;
  const date = new Date();
  // Why does const not work
  // const mainImage = req.file ? req.file.filename : 'noimage.jpg'
  
  if(req.file) {
    console.log('Image File Upload');
    var mainimage = req.file.filename;
  } else {
    console.log('Failed to Upload File');
    var mainimage = 'noimage.jpg';
  }

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
    const posts = db.get('posts');
    posts.insert({
      'title': title,
      'body': body,
      'category': category,
      'date': date,
      'date': date,
      'author': author,
      'mainimage': mainimage
    }, (err, post) => {
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

module.exports = router;
