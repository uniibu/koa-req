const helmet = require('helmet');
const {promisify} = require('util');

const kHelmet = () => {
  const helmetAsync = promisify(helmet.apply(null, arguments)); // eslint-disable-line
  const mw = async ({req, secure, request, res}, next) => {
    req.secure = secure || request.secure;
    await helmetAsync(req, res);
    return next();
  };
  mw._name = 'helmet';
  return mw;
};

for(const [method, fn] of Object.entries(helmet)){
  kHelmet[method] = function () {
    const methodAsync = promisify(fn.apply(null, arguments)); 
    const mw = async ({req, secure, request, res}, next) => {
      req.secure = secure || request.secure;
      await methodAsync(req, res);
      return next();
    };
    return mw;
  };
}

module.exports = kHelmet;