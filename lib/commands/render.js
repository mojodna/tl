"use strict";

var fs = require("fs");

var abaculus = require("abaculus");

module.exports = function(parser, tilelive) {
  parser.command("render")
    .options({
      source: {
        position: 1,
        help: "source URI",
        required: true
      },
      bounds: {
        abbr: "b",
        metavar: "BBOX",
        help: "WGS84 bounding box (minX minY maxX maxY)",
        transform: function(val) {
          return val.split(" ").map(Number);
        }
      },
      zoom: {
        full: "zoom",
        abbr: "z",
        metavar: "ZOOM",
        help: "Zoom",
        required: true
      },
      center: {
        full: "center",
        abbr: "c",
        metavar: "CENTER",
        help: "Center (lon lat)",
        transform: function(val) {
          return val.split(" ").map(Number);
        }
      },
      dimensions: {
        full: "dimensions",
        abbr: "d",
        metavar: "DIMENSIONS",
        help: "Size (width height)",
        transform: function(val) {
          return val.split(" ").map(Number);
        }
      },
      scale: {
        full: "scale",
        abbr: "s",
        metavar: "SCALE",
        help: "Scale (1-4)"
      },
      format: {
        full: "format",
        abbr: "f",
        metavar: "FORMAT",
        help: "Format (png|jpeg)"
      },
      quality: {
        full: "quality",
        abbr: "q",
        metavar: "QUALITY",
        help: "Quality (0-100 for JPEGs, 2-256 (colors) for PNGs)"
      },
      output: {
        full: "output",
        abbr: "o",
        metavar: "FILENAME",
        help: "Output filename"
      },
      require: {
        abbr: "r",
        metavar: "MODULE",
        help: "Require a specific tilelive module",
        list: true
      }
    })
    .callback(function(opts) {
      opts.bounds = opts.bounds || [];
      opts.center = opts.center || [];
      opts.dimensions = opts.dimensions || [];

      if (!(opts.bounds.length ||
            (opts.center.length === 2 && opts.dimensions.length === 2))) {
        console.error(parser.getUsage());
        console.error("Bounding box and zoom or center and dimensions are required");
        process.exit(1);
      }

      require("../modules")(tilelive, opts);

      return tilelive.load(opts.source, function(err, source) {
        if (err) {
          throw err;
        }

        var params = {
          zoom: opts.zoom,
          scale: opts.scale,
          format: opts.format,
          quality: opts.quality,
          getTile: source.getTile.bind(source)
        };

        if (opts.bounds.length === 4) {
          params.bbox = opts.bounds;
        } else {
          params.center = {
            x: opts.center[0],
            y: opts.center[1],
            w: opts.dimensions[0],
            h: opts.dimensions[1]
          };
        }

        return abaculus(params, function(err, image, headers) {
          if (err) {
            throw err;
          }

          Object.keys(headers).forEach(function(k) {
            console.warn("%s: %s", k, headers[k]);
          });

          if (opts.output) {
            return fs.writeFileSync(opts.output, image);
          }

          process.stdout.write(image);
        });
      });

    })
    .help("Render an area using a tilelive provider");
};
