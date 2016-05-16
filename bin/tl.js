#!/usr/bin/env node
"use strict";

// increase the libuv threadpool size to 1.5x the number of logical CPUs.
process.env.UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || Math.ceil(Math.max(4, require('os').cpus().length * 1.5));

var fs = require("fs"),
    path = require("path");

var tilelive = require("tilelive-cache")(require("tilelive-streaming")(require("tilelive"))),
    yargs = require("yargs");

yargs
  .usage("$0 [args] <command> [args]")
  .option("r", {
    alias: "require",
    describe: "Require a specific tilelive module",
  })
  .alias({
    help: "h",
    version: "v"
  })
  .help()
  .require("command")
  .strict()
  .version();

var commandDir = path.join(__dirname, "..", "lib", "commands");

fs.readdirSync(commandDir)
  .filter(function(x) {
    return path.extname(x) === ".js";
  })
  .forEach(function(x) {
    require(path.join(commandDir, x))(yargs, tilelive);
  });

yargs.argv;

// var args = parser.parse();
//
// if (args.command) {
//   // no command matched
//   parser.parse("--help");
//   process.exit(1);
// }
