
/* Passport experiments */

var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

module.exports = function(app) {

  var UsersModel = app.models.Users;

  var GITHUB_CLIENT_ID = 'cfa4df38c050e4ba324c';
  var GITHUB_CLIENT_SECRET = 'c94d67aae78e37c912c4a433cd1f8e135cea50f4';

  passport.use(new GitHubStrategy({
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://fpc:3000/auth/github/callback",
    },
    function(accessToken, refreshToken, profile, done) {
      UsersModel.externalLoginOrCreate(profile, done);
    }
  ));

  /* Здесь должна происходить сериализация пользователя но по факту входным
   * параметром является токен.
   */
  passport.serializeUser(function(accessToken, done) {
    done(null, accessToken);
  });

  app.use(passport.initialize());

  app.get('/auth/github',
    passport.authenticate('github', { scope: [ 'user:email' ] }));

  app.get(
    '/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
      res.json(req.user);
    }
  );
}
