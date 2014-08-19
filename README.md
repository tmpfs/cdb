Table of Contents
=================

* [rlx](#rlx)
  * [Install](#install)
  * [Usage](#usage)
  * [Developer](#developer)
    * [Test](#test)
    * [Manual](#manual)
    * [Readme](#readme)

rlx
===

Command line interface for [couchdb](http://couchdb.apache.org) designed for POSIX systems.

Requires [node](http://nodejs.org) and [npm](http://www.npmjs.org).

## Install

```
npm i -g rlx
```

## Usage

```
Command line interface for couchdb.

Usage: rlx <command> [-vh] [--color|--no-color] [--debug]
           [-v|--verbose] [-h|--help] [--version] [-s|--server=<url>]
           [-d|--database=<name>] [-u|--username=<name>]
           [-p|--password=<pass>] [-o|--output=<file>]
           [-f|--file=<file>] [-j|--json=<json>]
           [-t|--template=<name>] [--id=<id>] [--rev=<rev>] <args>

Options:

Command should be one of: info, stats, uuids, database, tasks, log, config,
restart, session, admin, user, login, logout, list, security, edit, template,
lint, document, level, help.

Commands:
 info               Print server information.
 stats              Print server statistics.
 uuids              Print list of uuids.
 database, db       Manage databases.
 tasks              Print active tasks.
 log                Print server log.
 config, conf       Manage server configuration.
 restart            Restart a server.
 session, sess      Cookie-based session authentication.
 admin              Manage server administrators.
 user, usr          Manage server users.
 login              Login to a server.
 logout             Logout of current session.
 list, ls           List databases.
 security, sec      Get or set security document.
 edit               Edit a document.
 template, tpl      Manage template files.
 lint               Lint javascript and json.
 document, doc      Manage documents.
 level, lvl         Get or set the server log level.
 help               Show help for commands.

Arguments:
 -o, --output=[file]
                    Write response to output file.
     --[no]-color   Enable or disable terminal colors.
 -v, --verbose      Print more information.
 -s, --server=[url] Database server.
 -d, --database=[name]
                    Database name.
 -u, --username=[name]
                    Authentication username.
 -p, --password=[pass]
                    Authentication password.
     --debug        Enable debugging.
 -f, --file=[file]  Read JSON input from file.
 -j, --json=[json]  JSON string literal (overrides --file).
 -t, --template=[name]
                    Name of a template file.
     --id=[id]      Document identifier.
     --rev=[rev]    Document revision.
 -h, --help         Display this help and exit.
     --version      Output version information and exit.

Report bugs to https://github.com/freeformsystems/rlx-node/issues.
```

## Developer

### Test

Tests require a clean [couchdb](http://couchdb.apache.org) installation running in *admin party* mode.

```
npm test
```

Developed against `couchdb@1.6.0`, behaviour in earlier versions is undefined.

### Manual

To generate man pages run:

```
npm run manual
```

Generated man pages are in the [man](https://github.com/freeformsystems/rlx-node/blob/master/doc/man) directory.

To dynamically generate man pages set `NODE_ENV` to `devel` and execute a help command:

```
NODE_ENV=devel ./bin/sdk help db
```

### Readme

To build the readme file from the partial definitions:

```
npm run readme
```

Generated by [mdp(1)](https://github.com/freeformsystems/mdp).

[couchdb]: http://couchdb.apache.org
[node]: http://nodejs.org
[npm]: http://www.npmjs.org
[man]: https://github.com/freeformsystems/rlx-node/blob/master/doc/man
