#!/usr/bin/env node
"use strict";

// increase the libuv threadpool size to 1.5x the number of logical CPUs.
process.env.UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || Math.ceil(Math.max(4, require('os').cpus().length * 1.5));

var fs = require("fs"),
    path = require("path");

var parser = require("nomnom"),
    tilelive = require("tilelive-cache")(require("tilelive-streaming")(require("tilelive")));

parser.options({
  version: {
    abbr: "v",
    flag: true,
    help: "Show version info",
    callback: function() {
      return "tl v" + require("../package.json").version;
    }
  }
});

var commandDir = path.join(__dirname, "..", "lib", "commands"); 

fs.readdirSync(commandDir)
  .filter(function(x) {
    return path.extname(x) === ".js";
  })
  .forEach(function(x) {
    require(path.join(commandDir, x))(parser, tilelive);
  });

parser.parse();
