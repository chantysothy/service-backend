'use strict';

module.exports = function(Users) {
  Users.prototype.originalHasPassword = Users.prototype.hasPassword;

  Users.prototype.hasPassword = function(plain, fn){
    if (this.external){
      fn(null, true);
    } else {
      this.originalHasPassword(plain, fn);
    }
  }
};
