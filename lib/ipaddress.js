const ipaddr = require('ipaddr.js');
const parseIp = ip => {
  if (!ipaddr.isValid(ip)) {
    return false;
  }
  const addr = ipaddr.parse(ip);
  if (addr.kind() == 'ipv6') {
    if (addr.isIPv4MappedAddress()) {
      return addr.toIPv4Address().toString();
    }
  }
  return addr.toString();
};
module.exports = () => async ({ request }, next) => {
  request.ip = parseIp(request.ip) || request.ip;
  await next();
};