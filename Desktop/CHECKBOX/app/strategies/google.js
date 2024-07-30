const passport = require('passport');
const { Strategy: GoogleOIDCStrategy } = require('passport-google-oidc');
const db = require('../db');

module.exports = function configurePassport() {
  passport.use(
    new GoogleOIDCStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/oauth2/callback/google',
        scope: ['profile', 'email'],
      },
      function verifyUser(issuer, profile, done) {
        db.get(
          'SELECT * FROM users WHERE googleId = ?',
          [profile.id],
          function queryCallback(err, user) {
            if (err) {
              return done(err);
            }
            if (!user) {
              const { displayName, emails } = profile;
              const emailAddress = emails[0].value;
              db.run(
                'INSERT INTO users (name, email, provider, googleId) VALUES (?, ?, ?, ?)',
                [displayName, emailAddress, 'google', profile.id],
                function insertCallback(error) {
                  if (error) {
                    return done(error);
                  }
                  const newUser = {
                    id: this.lastID,
                    name: displayName,
                    email: emailAddress,
                    provider: 'google',
                    googleId: profile.id,
                  };
                  return done(null, newUser);
                }
              );
            } else {
              return done(null, user);
            }
          }
        );
      }
    )
  );
};

