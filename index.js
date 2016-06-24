const mysql = require('mysql-promise'),
  _ = require('lodash'),
  singletonsByKey = {};

module.exports = {
  getInstance: function (key, configIfFirstTime) {
    if (!singletonsByKey[key]) {
      singletonsByKey[key] = mysql(key);

      singletonsByKey[key].configure(configIfFirstTime);
    }
    const db = singletonsByKey[key];
    return _.extend(db, {
      q: function () {
        return db.query.apply(db, arguments)
          .then(function (result) {
            return result[0];
          })
      },
      querySingleRow: function () {
        return db.query.apply(db, arguments)
          .then(function (result) {
            return result[0] && result[0][0];
          })
      },
      count: function () {
        return db.query.apply(db, arguments)
          .then(function (result) {
            return result[0] && result[0][0] && result[0][0].count;
          })
      }
    });
  }
};
