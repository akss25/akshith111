const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/signin');
  }
  res.render('homepage', { user: req.user });
});

module.exports = router;
