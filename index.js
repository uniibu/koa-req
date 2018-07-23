const cors = require('@koa/cors');
const helmet = require('koa-helmet');
const ipFix = require('./lib/ipaddress');
const logger = require('koa-logger');
const defaultOPts = {
  loggerEnabled: true,
  corsEnabled: true,
  helmetEnabled: true,
  ipfixEnabled: true,
  cors: {},
  helmet: {}
};
module.exports = (app, opts = {}) => {
  opts = Object.assign({}, defaultOPts, opts);
  if (opts.ipfixEnabled) {
    app.use(ipFix());
  }
  if (opts.loggerEnabled) {
    app.use(logger());
  }
  if (opts.corsEnabled) {
    app.use(cors(opts.cors));
  }
  if (opts.helmetEnabled) {
    app.use(helmet(opts.helmet));
  }
};