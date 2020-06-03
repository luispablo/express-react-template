"use strict";

module.exports = function (configFileName) {
  
  const path = require("path");
  const express = require("express");
  const knex = require("knex");
  const http = require("http");
  const MultiLog = require("luispablo-multilog");
  const bodyParser = require("body-parser");
  const morgan = require("morgan");
  const TokenAuth = require("tokenauth");
  const serverRouter = require("./serverRouter");
  const WSCredentials = require("ws-credentials");
  const knexRouter = require("knex-router");
  
  const app = express();
  const server = http.Server(app);

  const log = MultiLog(config.multilog);
  const auth = TokenAuth(config.auth, log);
  const credentials = config.auth.mockUsers ?
    WSCredentials.Mock(config.auth.mockUsers) :
    WSCredentials(config.auth.webServiceURL, 443, config.auth.certificatePath);

  const authRoutes = auth.Router(credentials, config.auth.token.secret, config.auth.token.validDays, log);

  log.info(`Configuration taken from ${configFileName}`);

  app.knex = server.knex = knex(config.knex);

  app.use(morgan("dev")); // request logging
  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  app.use(express.static("public"));
  app.use("/api/knex", auth.Middleware, knexRouter({ knex: app.knex }));
  app.use("/api", serverRouter(auth.Middleware, authRoutes, app.knex, log));

  if (config.clientRouterHack) {
    // handle every other route with index.html, which will contain
    // a script tag to your application's JavaScript file(s).
    app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "../public", "index.html")));
  }

  return server;
};
