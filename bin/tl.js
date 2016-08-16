#!/usr/bin/env node
"use strict";

// increase the libuv threadpool size to 1.5x the number of logical CPUs.
process.env.UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || Math.ceil(Math.max(4, require('os').cpus().length * 1.5));

var fs = require("fs"),
    path = require("path");

var tilelive = require("tilelive-cache")(require("tilelive-streaming")(require("tilelive"))),
    yargs = require("yargs");

// mangle process.argv such that quoted -b values are split out
// this is necessary to support unquoted values correctly, as nargs must be 4 in that case
var argv = process.argv.slice();

argv.forEach(function(x, i) {
  if ((argv[i - 1] === "-b" ||
       argv[i - 1] === "--bounds") &&
      x.match(/(\s)/g).length === 3) {
    var coords = x.split(" ").map(function(coord) {
      return coord.trim();
    });

    argv.splice.apply(argv, [i, 1].concat(coords));
  }
});

yargs(argv)
  .usage("$0 [args] <command> [args]")
  .option("r", {
    alias: "require",
    describe: "Require a specific tilelive module",
    global: true
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
