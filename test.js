var fs = require('fs')
var path = require('path')
var test = require('tape')
var rimraf = require('rimraf')
var encoding = require('dat-encoding')

var archiveFolder = require('.')
var datDir = path.join(__dirname, '.dat')
var key

test('creates archive folder', function (t) {
  rimraf.sync(datDir)
  archiveFolder(__dirname, {}, function (err, archive, db) {
    t.error(err, 'no callback error')
    key = archive.key
    t.ok(archive, 'returns archive')
    t.ok(db, 'returns db')
    t.doesNotThrow(function () { checkDirExists(datDir) }, '.dat folder created')
    archive.close(function () {
      db.close(function () {
        t.end()
      })
    })
  })
})

// this test must follow the one that creates an archive
test('resume archive', function (t) {
  archiveFolder(__dirname, {resume: true}, function (err, archive, db) {
    t.error(err, 'no callback error')
    t.ok(archive.resumed, 'sets archive.resumed to true')
    t.ok(archive, 'archive okay')
    t.same(archive.key, key, 'key matches old one')
    archive.close(function () {
      db.close(function () {
        t.end()
      })
    })
  })
})

// this test must follow the one that creates an archive
test('resume archive with buffer key', function (t) {
  archiveFolder(__dirname, {resume: true, key: encoding.toBuf(key)}, function (err, archive, db) {
    t.error(err, 'no callback error')
    t.ok(archive.resumed, 'sets archive.resumed to true')
    t.ok(archive, 'archive okay')
    t.same(archive.key, key, 'key matches old one')
    archive.close(function () {
      db.close(function () {
        t.end()
      })
    })
  })
})

// this test must follow the one that creates an archive
test('resume archive with string key', function (t) {
  archiveFolder(__dirname, {resume: true, key: encoding.toStr(key)}, function (err, archive, db) {
    t.error(err, 'no callback error')
    t.ok(archive.resumed, 'sets archive.resumed to true')
    t.ok(archive, 'archive okay')
    t.same(archive.key, key, 'key matches old one')
    archive.close(function () {
      db.close(function () {
        t.end()
      })
    })
  })
})

// this test must follow the one that create/resumes an archive
test('resume + bad key does not match existing', function (t) {
  archiveFolder(__dirname, {resume: true, key: new Array(65).join('d')}, function (err, archive, db) {
    t.ok(err, 'callback with error')
    db.close(function () {
      t.end()
    })
  })
})

// this test must follow the one that create/resumes an archive
test('resume false with existing archive', function (t) {
  archiveFolder(__dirname, {resume: false}, function (err, archive, db) {
    t.ok(err, 'callback with error')
    t.end()
  })
})

test('try resume without existing archive', function (t) {
  rimraf.sync(datDir)
  archiveFolder(__dirname, {resume: true}, function (err) {
    t.ok(err, 'callback with error')
    t.end()
  })
})

test('no dir fails', function (t) {
  t.throws(archiveFolder, 'throws with no args')
  t.throws(function () { archiveFolder({}) }, 'throws with only opts arg')
  t.throws(function () { archiveFolder(noop) }, 'throws with only cb arg')
  t.throws(function () { archiveFolder({}, noop) }, 'throws with opts and cb arg')
  t.end()
})

test('drive option', function (t) {
  rimraf.sync(datDir)
  var something = {}
  archiveFolder(__dirname, {resume: true, drive: something}, function (err) {
    t.fails('TODO: do this test')
    t.end()
  })
})

function checkDirExists (dir) {
  fs.accessSync(dir, fs.F_OK)
}

function noop () { }
