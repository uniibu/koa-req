const cors = require('@koa/cors');
const helmet = require('koa-helmet');
const logger = require('koa-log-lite');
const defaultOPts = {
  loggerEnabled: true,
  corsEnabled: true,
  helmetEnabled: true,
  cors: {},
  helmet: {}
};
module.exports = (app, opts = {}) => {
  opts = Object.assign({}, defaultOPts, opts);
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