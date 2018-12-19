'use strict';

var dotenv = require('dotenv');
dotenv.config();
module.exports.config = {
  prefix: process.env.API_PREFIX,
  baseURL: process.env.API_URL,
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  msdin: process.env.MSDIN,
  shortcode: process.env.SHORT_CODE,
  certpath: process.env.CERT_PATH
};