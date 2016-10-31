'use strict';

module.exports = function(server) {
  var MySQLDataSource = server.dataSources.MySQL;

  var applicationModels = ['User', 'AccessToken', 'ACL', 'RoleMapping', 'Role'];

  MySQLDataSource.isActual(applicationModels, function(err, actual) {
    if (!actual) {
      MySQLDataSource.autoupdate(applicationModels, function(err) {
        if (err) throw (err);
      });
    }
  });
}
