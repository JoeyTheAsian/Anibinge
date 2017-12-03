'use strict';

const authenticate = require('./lib/authenticate');
const request = require('./lib/request');

let nani = {
  init: function (id, secret) {
    this.id = id;
    this.secret = secret;

    return this;
  },
  id: '',
  secret: '',
  authInfo: {
    token: '',
    expires: ''
  }
};

nani.authenticate = function () {
  let id = this.id;
  let secret = this.secret;

  return authenticate(id, secret)
    .then(data => {
      this.authInfo.token = data.token;
      this.authInfo.expires = data.expires;
    });
};

nani.get = function (query) {
  return request(this.authInfo, query)
    .catch(error => {
      if (error.message !== 'Token does not exist or has expired') {
        throw error;
      } else {
        return this.authenticate()
          .then(() => this.get(query));
      }
    });
};

module.exports = nani;
