'use strict';

module.exports = function(Users) {

  Users.externalLoginOrCreate = function(profile, done) {
    Users.findOne({ email: profile._json.email}, function(err, instance){
      var externalUserEror = new Error('User exist as interal but tryed to login as external');
      externalUserEror.statusCode = 422;
      externalUserEror.code = 'INTERNAL_IS_EXTERNAL';

      if(err) return done(err, false);

      if(instance.external === false){
        return done(externalUserEror, false);
      }

      done(null, instance);
    })
  }

  Users.observe('before save', function(ctx, next) {
    if (ctx.options && ctx.options.skipPropertyFilter) return next();
    // TODO: ctx.inNewInstance can be used only in memory, MySQL and MongoDB connectors
    if (ctx.isNewInstance) {
      ctx.instance.external = false;
    } else {
      // TODO: Send it to global configurable
      ctx.instance.unsetAttribute('external');
    }
    next();
  });

  Users.prototype.originalHasPassword = Users.prototype.hasPassword;

  Users.prototype.hasPassword = function(plain, fn){
    if (this.external){
      fn(null, true);
    } else {
      this.originalHasPassword(plain, fn);
    }
  }
};
