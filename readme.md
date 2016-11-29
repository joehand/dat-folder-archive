# dat-folder-archive [![Travis](https://img.shields.io/travis/joehand/dat-folder-archive.svg?style=flat-square)](https://travis-ci.org/joehand/dat-folder-archive) [![npm](https://img.shields.io/npm/v/dat-folder-archive.svg?style=flat-square)](https://npmjs.org/package/dat-folder-archive)

Creates an archive in a folder using the `.dat` folder database.

* Creates an archive with base as `dir`
* Create/Open a level db in `dir/.dat`
* Resumes existing archives

Similar to [dat-folder-db](https://github.com/joehand/dat-folder-db), but also creates an archive and saves the key to the database.

## Usage

Use `dat-folder-archive` to create a `.dat` folder and get the archive & database to be used in other modules.

For example, to import the current directory, share it over the dat network, and track the stats:

```js
var folderArchive = require('dat-folder-archive')
var hyperdiscovery = require('hyperdiscovery')
var hyperstats = require('hyperdrive-stats')
var hyperimport = require('hyperdrive-import-files')

var dir = process.cwd()

folderArchive(dir, {resume: false}, function (err, archive, db) {
  if (err) return cb(err)
  console.log('archive ready')

  // import files from cwd
  var importer = hyperimport(archive, dir, function (err) {
    console.log('done importing')
  })

  // join the network & start replication
  var swarm = hyperdiscovery(archive)

  // track stats for the archive
  var stats = hyperstats({archive: archive, db: db})
  stats.on('update', function () {
    console.log(stats.get())
  })
})
```

## API

### `datFolderArchive(directory, [opts], callback)`

Creates a hyperdrive archive in `directory`, including making a `.dat` database, using [dat-folder-db](https://github.com/joehand/dat-folder-db).

The callback returns `cb(err, archive, db)`.

Options are passed to hyperdrive. They can include:

```js
opts = {
  live: true, // archive is live
  resume: null, // force resume (see below)
  file: raf(dir, name) // file option for hyperdrive archive
}
```

#### Creating and Resuming an Archive

The `.dat` folder can be used to persist an archive in a folder. When creating a *new* archive in a directory, use `opts.resume` to specify what you're expecting in the folder:

* `resume = false`: create an archive *only if* no archive exists in the given directory.
* `resume = true`: resume an archive only if it *already* exists and, if specified,  `opts.key` matches the key in the `.dat` folder.
* `resume = null` (default): create or resume an archive. If `opts.key` is specified, check to make sure key matches.

The callback will set `archive.resume = true` if the archive was resumed, not newly created.

## License 

MIT
