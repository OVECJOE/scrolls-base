#!/bin/sh
set -a
. ./.env
set +a
pm2 start process.yml --no-daemon