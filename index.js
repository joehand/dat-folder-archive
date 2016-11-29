var assert = require('assert')
var path = require('path')
var extend = require('xtend')
var datDb = require('dat-folder-db')
var datKeyAs = require('dat-key-as')
var hyperdrive = require('hyperdrive')
var raf = require('random-access-file')

module.exports = function (dir, opts, cb) {
  assert.ok(dir, 'dat-folder-archive: directory required')
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }
  assert.ok(typeof cb === 'function', 'dat-folder-archive: callback required')

  opts.key = datKeyAs.buf(opts.key)
  opts = extend({
    live: true,
    resume: null,
    file: function (name) {
      return raf(path.join(dir, name))
    }
  }, opts)

  datDb(dir, opts, function (err, db, key, saveKey) {
    if (err) return cb(err)
    key = datKeyAs.buf(key)

    // TODO: make these clearer (for user and developers)
    if (opts.resume && !key) return cb('No existing archive, cannot resume.')
    if (opts.resume === false && key) return cb('Archive exists in directory, cannot overwrite')
    if (key && opts.key && opts.key !== key) return cb('Error: Destination path already exists and contains a different dat.')

    var archive = createArchive(db, key || opts.key, opts)
    if (!archive.key) return done() // not live archive
    if (key) {
      // Key already in db, resuming
      archive.resume = true // TODO: better way to set resume?
      return done()
    }
    saveKey(archive.key, function (err) {
      // Saves key back to db for resuming.
      if (err) return cb(err)
      done()
    })

    function done () {
      return cb(null, archive, db)
    }
  })

  function createArchive (db, key, opts) {
    var drive = hyperdrive(db)
    var archive = drive.createArchive(key, opts)

    return archive
  }
}
