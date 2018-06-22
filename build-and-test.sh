#!/usr/bin/env bash

set -xe

# Let's replace the "." by a "-" with some bash magic
docker build -t thecodingmachine/nodejs:${BRANCH}-${VARIANT} -f Dockerfile.${VARIANT} .

# Post build unit tests
if [[ $VARIANT == apache* ]]; then CONTAINER_CWD=/var/www/html; else CONTAINER_CWD=/usr/src/app; fi
# Default user is 1000
RESULT=`docker run --rm thecodingmachine/nodejs:${BRANCH}-${VARIANT} id -ur`
[[ "$RESULT" = "1000" ]]

# If mounted, default user has the id of the mount directory
mkdir user1999 && sudo chown 1999:1999 user1999
ls -al user1999
RESULT=`docker run -v $(pwd)/user1999:$CONTAINER_CWD thecodingmachine/nodejs:${BRANCH}-${VARIANT} id -ur`
[[ "$RESULT" = "1999" ]]
sudo rm -rf user1999

# Let's check that the crons are actually sending logs in the right place
RESULT=`docker run --rm -e CRON_SCHEDULE_1="@reboot" -e CRON_COMMAND_1="(>&1 echo "foobar")" thecodingmachine/nodejs:${BRANCH}-${VARIANT} sleep 1`
[[ "$RESULT" = "[Cron] foobar" ]]

docker run --rm -e CRON_SCHEDULE_1="@reboot" -e CRON_COMMAND_1="(>&2 echo "error")" thecodingmachine/nodejs:${BRANCH}-${VARIANT} sleep 1 2>tmp.err
RESULT=`cat tmp.err`
[[ "$RESULT" = "[Cron error] error" ]]
rm tmp.err

echo "Tests passed with success"

docker build -t thecodingmachine/nodejs:${VARIANT} -f Dockerfile.${VARIANT} .
