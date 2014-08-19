Library for [couchdb][] designed for [rlx][] using [request][].

This module differs from modules such as [nano][] in that it is designed to have feature parity with the [couch-api][]. As such it exhibits some interesting behaviour:

1. Encapsulates many constants for [couchdb][], see [config.js](/config.js), [levels.js](/levels.js).
2. Stashes request information so that a history of requests is available and the last request may be repeated.
3. Exposes schema descriptors that may be used with [async-validate][], see [schema](/lib/schema).
