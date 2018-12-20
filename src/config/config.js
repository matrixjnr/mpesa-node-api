'use strict';

var dotenv = require('dotenv');
dotenv.config();
const config = {
  environment: process.env.API_ENVIRONMENT,
  baseURL: process.env.API_URL,
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  msdin: process.env.MSDIN,
  shortcode: process.env.SHORT_CODE,
  certpath: process.env.CERT_PATH
};

module.exports = config;