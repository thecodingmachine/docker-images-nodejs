#!/bin/bash

set -e

exec "sudo" "-E" "tini" "-s" "--" "/usr/local/bin/docker-entrypoint-as-root.sh" "$@";
