module.exports = {
  "vendor": {
    "name": "vendor",
    "keys": {
      "name": "name",
      "version": "version"
    },
    "defaults": {
      "name": "The Apache Software Foundation",
      "version": "1.6.0"
    }
  },
  "couchdb": {
    "name": "couchdb",
    "keys": {
      "database_dir": "database_dir",
      "view_index_dir": "view_index_dir",
      "util_driver_dir": "util_driver_dir",
      "max_document_size": "max_document_size",
      "os_process_timeout": "os_process_timeout",
      "max_dbs_open": "max_dbs_open",
      "delayed_commits": "delayed_commits",
      "uri_file": "uri_file",
      "file_compression": "file_compression",
      "attachment_stream_buffer_size": "attachment_stream_buffer_size",
      "plugin_dir": "plugin_dir"
    },
    "defaults": {
      "database_dir": "/usr/local/xpm/pkg/couchdb-1.6.0/var/lib/couchdb",
      "view_index_dir": "/usr/local/xpm/pkg/couchdb-1.6.0/var/lib/couchdb",
      "util_driver_dir": "/usr/local/xpm/pkg/couchdb-1.6.0/lib/couchdb/erlang/lib/couch-1.6.0/priv/lib",
      "max_document_size": "4294967296 ",
      "os_process_timeout": "5000 ",
      "max_dbs_open": "100",
      "delayed_commits": "true ",
      "uri_file": "/usr/local/xpm/pkg/couchdb-1.6.0/var/run/couchdb/couch.uri",
      "file_compression": "snappy",
      "attachment_stream_buffer_size": "4096",
      "plugin_dir": "/usr/local/xpm/pkg/couchdb-1.6.0/lib/couchdb/plugins"
    }
  },
  "database_compaction": {
    "name": "database_compaction",
    "keys": {
      "doc_buffer_size": "doc_buffer_size",
      "checkpoint_after": "checkpoint_after"
    },
    "defaults": {
      "doc_buffer_size": "524288 ",
      "checkpoint_after": "5242880 "
    }
  },
  "view_compaction": {
    "name": "view_compaction",
    "keys": {
      "keyvalue_buffer_size": "keyvalue_buffer_size"
    },
    "defaults": {
      "keyvalue_buffer_size": "2097152 "
    }
  },
  "httpd": {
    "name": "httpd",
    "keys": {
      "port": "port",
      "bind_address": "bind_address",
      "authentication_handlers": "authentication_handlers",
      "default_handler": "default_handler",
      "secure_rewrites": "secure_rewrites",
      "vhost_global_handlers": "vhost_global_handlers",
      "allow_jsonp": "allow_jsonp",
      "socket_options": "socket_options",
      "log_max_chunk_size": "log_max_chunk_size",
      "enable_cors": "enable_cors"
    },
    "defaults": {
      "port": "5984",
      "bind_address": "127.0.0.1",
      "authentication_handlers": "{couch_httpd_oauth, oauth_authentication_handler}, {couch_httpd_auth, cookie_authentication_handler}, {couch_httpd_auth, default_authentication_handler}",
      "default_handler": "{couch_httpd_db, handle_request}",
      "secure_rewrites": true,
      "vhost_global_handlers": "_utils, _uuids, _session, _oauth, _users",
      "allow_jsonp": false,
      "socket_options": "[{recbuf, 262144}, {sndbuf, 262144}]",
      "log_max_chunk_size": "1000000",
      "enable_cors": false
    }
  },
  "ssl": {
    "name": "ssl",
    "keys": {
      "port": "port"
    },
    "defaults": {
      "port": "6984"
    }
  },
  "log": {
    "name": "log",
    "keys": {
      "file": "file",
      "level": "level",
      "include_sasl": "include_sasl"
    },
    "defaults": {
      "file": "/usr/local/xpm/pkg/couchdb-1.6.0/var/log/couchdb/couch.log",
      "level": "info",
      "include_sasl": true
    }
  },
  "couch_httpd_auth": {
    "name": "couch_httpd_auth",
    "keys": {
      "authentication_db": "authentication_db",
      "authentication_redirect": "authentication_redirect",
      "require_valid_user": "require_valid_user",
      "timeout": "timeout",
      "auth_cache_size": "auth_cache_size",
      "allow_persistent_cookies": "allow_persistent_cookies",
      "iterations": "iterations"
    },
    "defaults": {
      "authentication_db": "_users",
      "authentication_redirect": "/_utils/session.html",
      "require_valid_user": false,
      "timeout": "600 ",
      "auth_cache_size": "50 ",
      "allow_persistent_cookies": "false ",
      "iterations": "10 "
    }
  },
  "cors": {
    "name": "cors",
    "keys": {
      "credentials": "credentials"
    },
    "defaults": {
      "credentials": false
    }
  },
  "couch_httpd_oauth": {
    "name": "couch_httpd_oauth",
    "keys": {
      "use_users_db": "use_users_db"
    },
    "defaults": {
      "use_users_db": false
    }
  },
  "query_servers": {
    "name": "query_servers",
    "keys": {
      "javascript": "javascript",
      "coffeescript": "coffeescript"
    },
    "defaults": {
      "javascript": "/usr/local/xpm/pkg/couchdb-1.6.0/bin/couchjs /usr/local/xpm/pkg/couchdb-1.6.0/share/couchdb/server/main.js",
      "coffeescript": "/usr/local/xpm/pkg/couchdb-1.6.0/bin/couchjs /usr/local/xpm/pkg/couchdb-1.6.0/share/couchdb/server/main-coffee.js"
    }
  },
  "query_server_config": {
    "name": "query_server_config",
    "keys": {
      "reduce_limit": "reduce_limit",
      "os_process_limit": "os_process_limit"
    },
    "defaults": {
      "reduce_limit": true,
      "os_process_limit": "25"
    }
  },
  "daemons": {
    "name": "daemons",
    "keys": {
      "index_server": "index_server",
      "external_manager": "external_manager",
      "query_servers": "query_servers",
      "vhosts": "vhosts",
      "httpd": "httpd",
      "stats_aggregator": "stats_aggregator",
      "stats_collector": "stats_collector",
      "uuids": "uuids",
      "auth_cache": "auth_cache",
      "replicator_manager": "replicator_manager",
      "os_daemons": "os_daemons",
      "compaction_daemon": "compaction_daemon"
    },
    "defaults": {
      "index_server": "{couch_index_server, start_link, []}",
      "external_manager": "{couch_external_manager, start_link, []}",
      "query_servers": "{couch_query_servers, start_link, []}",
      "vhosts": "{couch_httpd_vhost, start_link, []}",
      "httpd": "{couch_httpd, start_link, []}",
      "stats_aggregator": "{couch_stats_aggregator, start, []}",
      "stats_collector": "{couch_stats_collector, start, []}",
      "uuids": "{couch_uuids, start, []}",
      "auth_cache": "{couch_auth_cache, start_link, []}",
      "replicator_manager": "{couch_replicator_manager, start_link, []}",
      "os_daemons": "{couch_os_daemons, start_link, []}",
      "compaction_daemon": "{couch_compaction_daemon, start_link, []}"
    }
  },
  "httpd_global_handlers": {
    "name": "httpd_global_handlers",
    "keys": {
      "/": "/",
      "favicon.ico": "favicon.ico",
      "_utils": "_utils",
      "_all_dbs": "_all_dbs",
      "_active_tasks": "_active_tasks",
      "_config": "_config",
      "_replicate": "_replicate",
      "_uuids": "_uuids",
      "_restart": "_restart",
      "_stats": "_stats",
      "_log": "_log",
      "_session": "_session",
      "_oauth": "_oauth",
      "_db_updates": "_db_updates",
      "_plugins": "_plugins"
    },
    "defaults": {
      "/": "{couch_httpd_misc_handlers, handle_welcome_req, <<\"Welcome\">>}",
      "favicon.ico": "{couch_httpd_misc_handlers, handle_favicon_req, \"/usr/local/xpm/pkg/couchdb-1.6.0/share/couchdb/www\"}",
      "_utils": "{couch_httpd_misc_handlers, handle_utils_dir_req, \"/usr/local/xpm/pkg/couchdb-1.6.0/share/couchdb/www\"}",
      "_all_dbs": "{couch_httpd_misc_handlers, handle_all_dbs_req}",
      "_active_tasks": "{couch_httpd_misc_handlers, handle_task_status_req}",
      "_config": "{couch_httpd_misc_handlers, handle_config_req}",
      "_replicate": "{couch_replicator_httpd, handle_req}",
      "_uuids": "{couch_httpd_misc_handlers, handle_uuids_req}",
      "_restart": "{couch_httpd_misc_handlers, handle_restart_req}",
      "_stats": "{couch_httpd_stats_handlers, handle_stats_req}",
      "_log": "{couch_httpd_misc_handlers, handle_log_req}",
      "_session": "{couch_httpd_auth, handle_session_req}",
      "_oauth": "{couch_httpd_oauth, handle_oauth_req}",
      "_db_updates": "{couch_dbupdates_httpd, handle_req}",
      "_plugins": "{couch_plugins_httpd, handle_req}"
    }
  },
  "httpd_db_handlers": {
    "name": "httpd_db_handlers",
    "keys": {
      "_all_docs": "_all_docs",
      "_changes": "_changes",
      "_compact": "_compact",
      "_design": "_design",
      "_temp_view": "_temp_view",
      "_view_cleanup": "_view_cleanup"
    },
    "defaults": {
      "_all_docs": "{couch_mrview_http, handle_all_docs_req}",
      "_changes": "{couch_httpd_db, handle_changes_req}",
      "_compact": "{couch_httpd_db, handle_compact_req}",
      "_design": "{couch_httpd_db, handle_design_req}",
      "_temp_view": "{couch_mrview_http, handle_temp_view_req}",
      "_view_cleanup": "{couch_mrview_http, handle_cleanup_req}"
    }
  },
  "httpd_design_handlers": {
    "name": "httpd_design_handlers",
    "keys": {
      "_compact": "_compact",
      "_info": "_info",
      "_list": "_list",
      "_rewrite": "_rewrite",
      "_show": "_show",
      "_update": "_update",
      "_view": "_view"
    },
    "defaults": {
      "_compact": "{couch_mrview_http, handle_compact_req}",
      "_info": "{couch_mrview_http, handle_info_req}",
      "_list": "{couch_mrview_show, handle_view_list_req}",
      "_rewrite": "{couch_httpd_rewrite, handle_rewrite_req}",
      "_show": "{couch_mrview_show, handle_doc_show_req}",
      "_update": "{couch_mrview_show, handle_doc_update_req}",
      "_view": "{couch_mrview_http, handle_view_req}"
    }
  },
  "uuids": {
    "name": "uuids",
    "keys": {
      "algorithm": "algorithm",
      "utc_id_suffix": "utc_id_suffix",
      "max_count": "max_count"
    },
    "defaults": {
      "algorithm": "sequential",
      "utc_id_suffix": "",
      "max_count": "1000"
    }
  },
  "stats": {
    "name": "stats",
    "keys": {
      "rate": "rate",
      "samples": "samples"
    },
    "defaults": {
      "rate": "1000",
      "samples": "[0, 60, 300, 900]"
    }
  },
  "attachments": {
    "name": "attachments",
    "keys": {
      "compression_level": "compression_level",
      "compressible_types": "compressible_types"
    },
    "defaults": {
      "compression_level": "8 ",
      "compressible_types": "text/*, application/javascript, application/json, application/xml"
    }
  },
  "replicator": {
    "name": "replicator",
    "keys": {
      "db": "db",
      "max_replication_retry_count": "max_replication_retry_count",
      "worker_processes": "worker_processes",
      "worker_batch_size": "worker_batch_size",
      "http_connections": "http_connections",
      "connection_timeout": "connection_timeout",
      "retries_per_request": "retries_per_request",
      "socket_options": "socket_options",
      "verify_ssl_certificates": "verify_ssl_certificates",
      "ssl_certificate_max_depth": "ssl_certificate_max_depth"
    },
    "defaults": {
      "db": "_replicator",
      "max_replication_retry_count": "10",
      "worker_processes": "4",
      "worker_batch_size": "500",
      "http_connections": "20",
      "connection_timeout": "30000",
      "retries_per_request": "10",
      "socket_options": "[{keepalive, true}, {nodelay, false}]",
      "verify_ssl_certificates": false,
      "ssl_certificate_max_depth": "3"
    }
  },
  "compaction_daemon": {
    "name": "compaction_daemon",
    "keys": {
      "check_interval": "check_interval",
      "min_file_size": "min_file_size"
    },
    "defaults": {
      "check_interval": "300",
      "min_file_size": "131072"
    }
  },
  "compactions": {
    "name": "compactions",
    "keys": {},
    "defaults": {}
  }
}