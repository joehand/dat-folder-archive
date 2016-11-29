# dat-folder-archive

Creates an archive in a folder using the `.dat` folder database.

* Creates an archive with base as `dir`
* Create/Open a db in `dir/.dat`
* Tries to resume existing archives

Similar to [dat-folder-db](https://github.com/joehand/dat-folder-db), but also creates an archive and saves the key to the database.

## Usage

## API

### `datFolderArchive(directory, [opts], callback)`

Creates a hyperdrive archive in `directory`, including making a `.dat` database, using [dat-folder-db](https://github.com/joehand/dat-folder-db).

If you are trying to resume an existing archive, use `opts.key`. `opts.key` needs to be the same as in the existing `.dat` folder.

The callback returns `cb(err, archive, db)`.

Other options are passed to hyperdrive.

## License 

MIT
