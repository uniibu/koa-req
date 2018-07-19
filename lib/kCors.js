module.exports = (options = {}) => {
  const defaultAllowHeaders = 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
  const defaultexposeHeaders = 'Content-Length,Content-Range';
  options = Object.assign({
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  }, options);

  if (Array.isArray(options.exposeHeaders)) {
    options.exposeHeaders = options.exposeHeaders.join(',');
  }
  if(options.exposeHeaders){
    options.exposeHeaders += `,${defaultexposeHeaders}`;
  }else{
    options.exposeHeaders = defaultexposeHeaders;
  }
  if (Array.isArray(options.allowMethods)) {
    options.allowMethods = options.allowMethods.join(',');
  }

  if (Array.isArray(options.allowHeaders)) {
    options.allowHeaders = options.allowHeaders.join(',');
  }
  if(options.allowHeaders){
    options.allowHeaders += `,${defaultAllowHeaders}`;
  }else{
    options.allowHeaders = defaultAllowHeaders;
  }
  options.maxAge = `${options.maxAge}` || 86400;

  options.credentials = !!options.credentials;
  options.keepHeadersOnError = options.keepHeadersOnError === undefined || !!options.keepHeadersOnError;

  return function cors(ctx, next) {
    if(options.strictMethod){
      if(!options.allowMethods.split(',').includes(ctx.method)){
        return ctx.throw(405);
      }
    }
    if(options.strictAgent){
      if(!ctx.get('User-Agent')){
        return ctx.throw(405);
      }
    }
    const requestOrigin = ctx.get('Origin');
    ctx.vary('Origin');

    if (!requestOrigin) {
      if(ctx.method == 'GET' || ctx.method == 'HEAD'){
        return next();
      }else{
        return ctx.throw(400);
      }
    }

    let origin;

    if (typeof options.origin === 'function') {
      // FIXME: origin can be promise
      origin = options.origin(ctx);
      if (!origin) {
        return next();
      }
    } else {
      origin = options.origin || requestOrigin;
    }

    const headersSet = {};

    function set(key, value) {
      ctx.set(key, value);
      headersSet[key] = value;
    }

    if (ctx.method !== 'OPTIONS') {
      // Simple Cross-Origin Request, Actual Request, and Redirects
      set('Access-Control-Allow-Origin', origin);

      if (options.credentials === true) {
        set('Access-Control-Allow-Credentials', 'true');
      }

      if (options.exposeHeaders) {
        set('Access-Control-Expose-Headers', options.exposeHeaders);
      }

      if (!options.keepHeadersOnError) {
        return next();
      }
      return next().catch(err => {
        err.headers = Object.assign({}, err.headers, headersSet);
        throw err;
      });
    } else {
      // Preflight Request
      if (!ctx.get('Access-Control-Request-Method')) {
        ctx.throw(400);
      }

      ctx.set('Access-Control-Allow-Origin', origin);

      if (options.credentials === true) {
        ctx.set('Access-Control-Allow-Credentials', 'true');
      }

      if (options.maxAge) {
        ctx.set('Access-Control-Max-Age', options.maxAge);
      }

      if (options.allowMethods) {
        ctx.set('Access-Control-Allow-Methods', options.allowMethods);
      }

      let {allowHeaders} = options;
      if (!allowHeaders) {
        allowHeaders = ctx.get('Access-Control-Request-Headers');
      }
      if (allowHeaders) {
        ctx.set('Access-Control-Allow-Headers', allowHeaders);
      }
      ctx.set('Content-Type', 'text/plain; charset=utf-8');
      ctx.set('Content-Length', '0');
      ctx.status = 204;
    }
  };
};