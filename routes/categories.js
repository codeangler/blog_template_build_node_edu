"use strict";
const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const db = require('monk')('localhost/nodeblog');

// Return selection of post by category
router.get('/show/:category', function(req, res, next) {
  const posts = db.get('posts');

  posts.find({category: req.params.category},{}, (err, posts)=>{
    res.render('index', {
      'title': req.params.category,
      'posts': posts
    });
  });
});


/* GET Categories-+ */
router.get('/add', function(req, res, next) {
  res.render('addCategory', {
    'title': 'Add Category'
  });
});

router.post('/add', function(req, res, next) {
  // Get the form values
  const name = req.body.name;
  
  //Form Validation
  req.checkBody('name', "Name field is required").notEmpty();

  // Check errors
  const errors = req.validationErrors();

  if (errors) {
    console.log('erring')
    res.render('addCategory', {
      'error': errors
    });
  } else {
    // POST to MongoDB
    console.log('posting');
    const categories = db.get('categories');
    categories.insert({
      'name': name
    }, (err, post) => {
      if(err) {
        res.send(err);
      } else {
        req.flash('success', 'Category Added');
        res.location('/');
        res.redirect('/');
      }
    });
  }
});

module.exports = router;
