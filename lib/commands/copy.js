"use strict";

var async = require("async");

module.exports = function(parser, tilelive) {
  parser.command("copy")
    .options({
      source: {
        position: 1,
        help: "source URI",
        required: true
      },
      sink: {
        position: 2,
        help: "sink URI",
        required: true
      },
      bounds: {
        abbr: "b",
        metavar: "BBOX",
        help: "WGS84 bounding box",
        default: [-180, -85.0511, 180, 85.0511],
        transform: function(val) {
          return val.split(" ").map(Number);
        }
      },
      minzoom: {
        full: "min-zoom",
        abbr: "z",
        metavar: "ZOOM",
        help: "Min zoom (inclusive)",
        default: 0
      },
      maxzoom: {
        full: "max-zoom",
        abbr: "Z",
        metavar: "ZOOM",
        help: "Max zoom (inclusive)",
        default: 22
      },
      scheme: {
        abbr: "s",
        metavar: "SCHEME",
        help: "Copy scheme",
        choices: ["scanline", "pyramid"],
        default: "scanline"
      }
    })
    .callback(function(opts) {
      return async.parallel({
        source: async.apply(tilelive.load, opts.source),
        sink: async.apply(tilelive.load, opts.sink)
      }, function(err, res) {
        if (err) {
          throw err;
        }

        var source = res.source,
            sink = res.sink;

        if (source.createReadStream) {
          console.log("Source supports streaming!");
        }

        if (sink.createWriteStream) {
          console.log("Sink supports streaming!");
        }

        // TODO it's up to streaming implementations to filter their output
        // according to these params
        source
          .createReadStream({
            minzoom: opts.minzoom,
            maxzoom: opts.maxzoom,
            bounds: opts.bounds
          })
          .pipe(sink.createWriteStream())
          .on("tile", function(tile) {
            console.log("%d/%d/%d\t%d", tile.z, tile.x, tile.y, tile.length);
          });
      });
    })
    .help("copy data");
};
