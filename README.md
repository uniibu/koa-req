# koa-req
      Koa v2 request middleware for adding extra security and cors on koa requests.

## Install
      `npm install koa-req`

## Usage
      ```js
      const Koa = require('koa');
      const kreq = require('koa-req')'
      const app = new Koa();
      kreq(app)
      ```

## Options
      `corsEnabled` - [Boolean] Default `true`
      `helmetEnabled` - [Boolean] Default `true`
      `ipFixEnabled` - [Boolean] Default `true`
      `loggerEnabled` - [Boolean] Default `true`
      `cors` - [Object] Contains options to pass to `koa/cors`
      `helmet` - [Object] Contains optiosn to pass to `koa-helmet`
