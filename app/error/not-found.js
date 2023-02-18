

'use strict';
const BaseError = require(APP_ERROR_PATH + 'base');

class NotFoundError extends BaseError {
    constructor(message) {
        super(message, 404);
    }
}

const baseErr="configuration success"

module.exports = NotFoundError;