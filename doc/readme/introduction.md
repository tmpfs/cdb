[![Build Status](https://travis-ci.org/tmpfs/cdb.svg)](https://travis-ci.org/tmpfs/cdb)
[![npm version](http://img.shields.io/npm/v/cdb.svg)](https://npmjs.org/package/cdb)
[![Coverage Status](https://coveralls.io/repos/tmpfs/cdb/badge.svg?branch=master&service=github&v=1)](https://coveralls.io/github/tmpfs/cdb?branch=master)

Library for [couchdb][] designed for [rlx][] using [request][].

This module differs from modules such as [nano][] in that it is designed to have feature parity with the [couch-api][]. As such it exhibits some interesting behaviour:

1. Encapsulates many constants for [couchdb][], see [constants](/lib/constants).
2. Stashes request information so that a history of requests is available and the last request may be repeated (useful for lazy authentication).
3. Exposes schema descriptors that may be used with [async-validate][], see [schema](/lib/schema).
