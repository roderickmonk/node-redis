'use strict';

global._ = require('lodash');
global.moment = require('moment');
global.r = require("ioredis").createClient();
global.path = require('path');
global.should = require('should');
global.utilTest = require('./util.test');
global.ApiError = require('../api-error');
