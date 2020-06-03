"use strict";

const port = process.env.PORT || 3000;
const configFileName = process.env.CONFIG_FILENAME || "config_dev.json";
const server = require("./app/server")(configFileName);
const notify = () => console.log(`App ready on port ${port}`); // eslint-disable-line no-console

server.listen(port, notify);
