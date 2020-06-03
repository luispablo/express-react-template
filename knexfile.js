const fs = require("fs");

const configDev = fs.existsSync("config_dev.json")? JSON.parse(fs.readFileSync("config_dev.json", "utf8")).knex : {};    
const configStaging = fs.existsSync("config_staging.json")? JSON.parse(fs.readFileSync("config_staging.json", "utf8")).knex : {};
const configUT = fs.existsSync("config_ut.json")? JSON.parse(fs.readFileSync("config_ut.json", "utf8")).knex : {};
const configProd = fs.existsSync("config_prod.json")? JSON.parse(fs.readFileSync("config_prod.json", "utf8")).knex : {};

// DB pass taken from command line on production
if (process.argv[4] && configProd) configProd.connection.password = process.argv[4];

module.exports = { 
  development: configDev, 
  staging: configStaging, 
  ut: configUT, 
  prod: configProd 
};
