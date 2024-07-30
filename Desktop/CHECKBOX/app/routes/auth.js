const express = require('express');
const passport = require('passport');
const router = express.Router();


router.get('/signin', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('signin');
});


router.post(
  '/signin',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/signin',
  })
);


router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));


router.get(
  '/oauth2/callback/google',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/signin',
  })
);


router.post('/signout', (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    req.session.destroy((error) => {
      if (error) {
        return next(error);
      }
      res.redirect('/signin');
    });
  });
});

module.exports = router;

