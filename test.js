var fs = require('fs')
var path = require('path')
var test = require('tape')
var rimraf = require('rimraf')

var archiveFolder = require('.')

test('creates archive folder', function (t) {
  var dir = path.join(__dirname, '.dat')
  rimraf.sync(dir)
  archiveFolder(__dirname, {}, function (err, archive, db) {
    t.error(err, 'no callback error')
    t.ok(archive, 'returns archive')
    t.ok(db, 'returns db')
    t.doesNotThrow(function () { checkDirExists(dir) }, '.dat folder created')
    t.end()
  })
})

test('resumes archive', function (t) {
  t.skip('TODO')
  t.end()
})

test('key does not match existing', function (t) {
  t.skip('TODO')
  t.end()
})

test('resume false with existing archive', function (t) {
  t.skip('TODO')
  t.end()
})

test('try resume without existing archive', function (t) {
  t.skip('TODO')
  t.end()
})

test('no dir fails', function (t) {
  t.throws(archiveFolder, 'throws with no args')
  t.throws(function () { archiveFolder({}) }, 'throws with only opts arg')
  t.throws(function () { archiveFolder(noop) }, 'throws with only cb arg')
  t.throws(function () { archiveFolder({}, noop) }, 'throws with opts and cb arg')
  t.end()
})

function checkDirExists (dir) {
  fs.accessSync(dir, fs.F_OK)
}

function noop () { }
