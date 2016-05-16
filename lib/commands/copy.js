"use strict";

var fs = require("fs"),
    path = require("path");

var async = require("async");

module.exports = function(yargs, tilelive) {
  yargs.command("copy <source> <sink>", "copy data between tilelive providers", function(yargs) {
    yargs.options({
      b: {
        alias: "bounds",
        array: true,
        describe: "WGS84 bounding box",
        default: "-180 -85.0511 180 85.0511",
        requiresArg: true,
        narg: 4
      },
      z: {
        alias: "min-zoom",
        describe: "Min zoom (inclusive)",
        default: 0,
        requiresArg: true,
        number: true
      },
      Z: {
        alias: "max-zoom",
        describe: "Max zoom (inclusive)",
        default: Infinity,
        requiresArg: true,
        number: true
      },
      s: {
        alias: "scheme",
        describe: "Copy scheme",
        choices: ["scanline", "pyramid"],
        default: "scanline",
        requiresArg: true,
        string: true
      },
      i: {
        alias: "info",
        describe: "TileJSON",
        normalize: true,
        requiresArg: true,
        string: true
      }
    });
  }, function(argv) {
    console.log("bounds:", argv.bounds);
    console.log("b:", argv.b);
    console.log(argv);
    process.exit();
    require("../modules")(tilelive, {
      require: argv.r
    });

    return async.parallel({
      source: async.apply(tilelive.load, argv.source),
      sink: async.apply(tilelive.load, argv.sink)
    }, function(err, res) {
      if (err) {
        throw err;
      }

      if (argv.info) {
        argv.info = JSON.parse(fs.readFileSync(path.resolve(argv.info)));
      }

      var source = res.source,
          sink = res.sink,
          writeStream = sink.createWriteStream({
            info: argv.info
          });

      source
        .createReadStream({
          minzoom: argv.z,
          maxzoom: argv.Z,
          bounds: argv.b
        })
        .pipe(writeStream)
        .on("tile", function(tile) {
          console.log("%d/%d/%d\t%d", tile.z, tile.x, tile.y, tile.length);
        });
    });
  });
};
