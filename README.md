# cdb

[![Build Status](https://travis-ci.org/tmpfs/cdb.svg)](https://travis-ci.org/tmpfs/cdb)
[![npm version](http://img.shields.io/npm/v/cdb.svg)](https://npmjs.org/package/cdb)
[![Coverage Status](https://coveralls.io/repos/tmpfs/cdb/badge.svg?branch=master&service=github&v=1)](https://coveralls.io/github/tmpfs/cdb?branch=master)

Library for [couchdb][] designed for [rlx][] using [request][].

This module differs from modules such as [nano][] in that it is designed to have feature parity with the [couch-api][]. As such it exhibits some interesting behaviour:

1. Encapsulates many constants for [couchdb][], see [constants](https://github.com/tmpfs/cdb/blob/master/lib/constants).
2. Stashes request information so that a history of requests is available and the last request may be repeated (useful for lazy authentication).
3. Exposes schema descriptors that may be used with [async-validate][], see [schema](https://github.com/tmpfs/cdb/blob/master/lib/schema).

---

- [Install](#install)
- [Developer](#developer)
  - [Test](#test)
  - [Cover](#cover)
  - [Lint](#lint)
  - [Clean](#clean)
  - [Import](#import)
  - [Readme](#readme)
- [License](#license)

---

## Install

```
npm i cdb --save
```

## Developer

### Test

Run the test specifications:

```
npm test
```

### Cover

To generate code coverage run:

```
npm run cover
```

### Lint

Run the source tree through [jshint][] and [jscs][]:

```
npm run lint
```

### Clean

Remove generated files:

```
npm run clean
```

### Import

Imports configuration data from `default.ini` into `config.js`:

```
npm run import
```

### Readme

To build the readme file from the partial definitions:

```
npm run readme
```

## License

MIT

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on December 27, 2016

[couchdb]: http://couchdb.apache.org
[couch-api]: http://docs.couchdb.org/en/latest/api/
[async-validate]: https://github.com/tmpfs/async-validate
[nano]: https://github.com/dscape/nano
[request]: https://github.com/mikeal/request
[node]: http://nodejs.org
[npm]: http://www.npmjs.org
[rlx]: https://github.com/tmpfs/rlx
[jshint]: http://jshint.com
[jscs]: http://jscs.info

