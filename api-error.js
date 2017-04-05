'use strict';

function ApiError(message, code) {
  this.name = 'ApiError';
  this.message = message || 'Default Message';
  this.code = code || 503;
  this.stack = (new Error()).stack;
}
ApiError.prototype = Object.create(Error.prototype);
ApiError.prototype.constructor = ApiError;

module.exports = ApiError;
