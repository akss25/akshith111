const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const database = require('../db');

module.exports = () => {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      (email, password, done) => {
        database.get(
          'SELECT * FROM users WHERE email = ?',
          [email],
          (error, userRecord) => {
            if (error) {
              return done(error);
            }
            if (!userRecord) {
              return done(null, false, { message: 'Email not found.' });
            }
            bcrypt.compare(password, userRecord.password, (error, isMatch) => {
              if (error) {
                return done(error);
              }
              if (isMatch) {
                return done(null, userRecord);
              } else {
                return done(null, false, { message: 'Invalid password.' });
              }
            });
          }
        );
      }
    )
  );
};
