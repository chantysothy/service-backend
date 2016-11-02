'use strict';

module.exports = function(server) {
  var MySQLDataSource = server.dataSources.MySQL;

  var applicationBuiltInModels = ['User', 'AccessToken', 'ACL', 'RoleMapping', 'Role'];
  var applicationModels = ['Users'];

  MySQLDataSource.isActual(applicationModels, function(err, actual) {
    if (!actual) {
      MySQLDataSource.autoupdate(applicationModels, function(err) {
        if (err) throw (err);
      });
    }
  });

  MySQLDataSource.automigrate(applicationBuiltInModels, function(err) {
    if (err) throw err;
  });
}
