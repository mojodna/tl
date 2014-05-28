"use strict";

module.exports = function(parser, tilelive) {
  parser.command("info")
    .options({
      uri: {
        position: 1,
        help: "tilelive URI"
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
