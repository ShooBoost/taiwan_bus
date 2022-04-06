const fs = require("fs");
module.exports = {
  devServer: {
    https: {
      key: fs.readFileSync(`${__dirname}/192.168.0.153-key.pem`),
      cert: fs.readFileSync(`${__dirname}/192.168.0.153.pem`),
    },
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/taiwan_bus/'
    : '/'
};