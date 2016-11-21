"use strict";
const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/add', function(req, res, next) {
  res.render('addpost', {
    'title': 'Add Post'
  });
});

module.exports = router;
