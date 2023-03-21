#!/bin/bash

set -e

exec "sudo" "-E" "tini" "-s" "-v" "--" "/usr/local/bin/docker-entrypoint-as-root.sh" "$@";
