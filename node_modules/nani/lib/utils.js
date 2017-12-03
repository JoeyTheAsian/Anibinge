'use strict';

const url = 'https://anilist.co/api/';
const now = () => Math.floor(Date.now() / 1000);
const isExpired = expirationTime => expirationTime <= now() + 300;
const hasParam = string => string.indexOf('?') !== -1;

module.exports = {
  url,
  isExpired,
  hasParam
};
