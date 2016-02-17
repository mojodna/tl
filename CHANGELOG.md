# Changes

## v0.7.0 2/16/16

* Increase `UV_THREADPOOL_SIZE`
* Upgrade to `tilelive-cache@^0.6.1` with improvements to `close()` handling
* Display usage when no command was provided

## v0.6.0 1/7/16

* Include changes merged via GitHub
* Pass `scale` parameter to sources

## v0.5.0 1/7/16

* Update dependencies

## v0.4.0 6/30/15

* Update `tilelive-streaming` for compatibility with Node-0.12.x and iojs
* Update `abaculus` for compatibility with Node-0.12.x and iojs

## v0.3.4 - 5/9/15

* Opt into retries if available
* Pick up fixes in `tilelive-streaming`

## v0.3.3 - 4/30/15

* Upstream concurrency improvements in `tilelive-streaming`

## v0.3.2 - 4/14/15

* Improve error logging when loading tilelive modules
* Update `tilelive-streaming` with concurrent buffering (for better throughput
  with flakey sources)

## v0.3.1 - 1/2/15

* Update `tilelive-streaming` for proper buffering (effectively increasing
  concurrency)

## v0.3.0 - 11/18/14

* Add `render` command

## v0.2.1 - 10/14/14

* Re-published without junk lying around

## v0.2.0 - 10/14/14

* Auto-register tilelive modules via `tilelive-modules`

## v0.1.1 - 10/13/14

* Relax `tilelive` version dependency to play better with other modules
* Depend on fixed `tilelive-streaming`

## v0.1.0 - 6/6/14

* Initial release
