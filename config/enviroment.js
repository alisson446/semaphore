'use strict';

const dotenv = require('dotenv');

dotenv.config({
	silent: process.env.NODE_ENV !== 'development'
}); 

const config = Object.freeze({
	firebase: {
		api_key: process.env.FB_API_KEY,
    auth_domain: process.env.FB_AUTH_DOMAIN,
    db_url: process.env.FB_DATABASE_URL,
    serviceAccount: {
      "type": "service_account",
      "project_id": process.env.PROJECT_ID,
      "private_key_id": process.env.PRIVATE_KEY_ID,
      "private_key": process.env.PRIVATE_KEY,
      "client_email": process.env.CLIENT_EMAIL,
      "client_id": process.env.CLIENT_ID,
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://accounts.google.com/o/oauth2/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL
    }
  }
});

module.exports = config;