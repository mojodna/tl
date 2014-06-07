#!/usr/bin/env node
"use strict";

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
  .forEach(function(x) {
    require(path.join(commandDir, x))(parser, tilelive);
  });

parser.parse();
