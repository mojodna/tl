"use strict";

module.exports = function(parser, tilelive) {
  parser.command("info")
    .options({
      uri: {
        position: 1,
        help: "tilelive URI"
      },
      require: {
        abbr: "r",
        metavar: "MODULE",
        help: "Require a specific tilelive module",
        list: true,
        callback: function(name) {
          var mod = require(name);

          if (typeof(mod.registerProtocols) === "function") {
            mod.registerProtocols(tilelive);
          } else {
            mod(tilelive);
          }
        }
      }
    })
    .callback(function(opts) {
      return tilelive.load(opts.uri, function(err, src) {
        if (err) {
          throw err;
        }

        return src.getInfo(function(err, info) {
          if (err) {
            throw err;
          }

          console.log("%j", info);
        });
      });
    })
    .help("get info");
};
