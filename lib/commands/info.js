"use strict";

module.exports = function(yargs, tilelive) {
  yargs.command("info <uri>", "Get info about a source", {}, function(argv) {
    require("../modules")(tilelive, {
      require: argv.r
    });

    return tilelive.load(argv.uri, function(err, src) {
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
  });
};
