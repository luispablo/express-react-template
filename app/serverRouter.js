"use strict";

const express = require("express");
const multer = require("multer");
const upload = multer();
const noCache = require("connect-nocache")();

module.exports = function (authMiddleware, authRoutes, knex, log) {

  const router = express.Router();

  return router;
};
