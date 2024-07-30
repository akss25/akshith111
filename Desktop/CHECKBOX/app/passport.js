const passport = require('passport');
const setupLocalStrategy = require('./strategies/local');
const setupGoogleStrategy = require('./strategies/google');

module.exports = (application) => {

  application.use(passport.initialize());
  application.use(passport.session());


  setupLocalStrategy();
  setupGoogleStrategy();


  passport.serializeUser((user, done) => {
    console.log(`Serializing user: ${user.id}`);
    done(null, user);
  });

 
  passport.deserializeUser((user, done) => {
    console.log(`Deserializing user: ${user.id}`);
    done(null, user);
  });
};
