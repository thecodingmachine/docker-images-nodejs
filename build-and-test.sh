#!/usr/bin/env bash

set -xe

docker buildx build --platform=linux/amd64 --load -t thecodingmachine/nodejs:${TAG} -f Dockerfile.${VARIANT} .

# Post build unit tests
if [[ $VARIANT == *apache* ]]; then CONTAINER_CWD=/var/www/html; else CONTAINER_CWD=/usr/src/app; fi
# Default user is 1000
RESULT=`docker run --rm thecodingmachine/nodejs:${TAG} id -ur`
[[ "$RESULT" = "1000" ]]

# If mounted, default user has the id of the mount directory
mkdir user1999 && sudo chown 1999:1999 user1999
ls -al user1999
RESULT=`docker run --rm -v "$(pwd)/user1999:$CONTAINER_CWD" thecodingmachine/nodejs:${TAG} id -ur`
[[ "$RESULT" = "1999" ]]
sudo rm -rf user1999

# Let's check that the crons are actually sending logs in the right place
RESULT=`docker run --rm -e CRON_SCHEDULE_1="* * * * * * *" -e CRON_COMMAND_1="(>&1 echo "foobar")" thecodingmachine/nodejs:${TAG} sleep 1 2>&1 | grep -oP 'msg=foobar' | head -n1`
[[ "$RESULT" = "msg=foobar" ]]

RESULT=`docker run --rm -e CRON_SCHEDULE_1="* * * * * * *" -e CRON_COMMAND_1="(>&2 echo "error")" thecodingmachine/nodejs:${TAG} sleep 1 2>&1 | grep -oP 'msg=error' | head -n1`
[[ "$RESULT" = "msg=error" ]]

# Let's check that the cron with a user different from root is actually run.
RESULT=`docker run --rm -e CRON_SCHEDULE_1="* * * * * * *" -e CRON_COMMAND_1="whoami" -e CRON_USER_1="docker" thecodingmachine/nodejs:${TAG} sleep 1 2>&1 | grep -oP 'msg=docker' | head -n1`
[[ "$RESULT" = "msg=docker" ]]

echo "Tests passed with success"

if [[ "$EVENT_NAME" == "push" || "$EVENT_NAME" == "schedule" ]]; then
  docker buildx build --platform=linux/amd64,linux/arm64 --push -t thecodingmachine/nodejs:${TAG} -f Dockerfile.${VARIANT} .
  docker login ghcr.io --username ${GITHUB_ACTOR} --password ${GITHUB_TOKEN}
  docker buildx build --platform=linux/amd64,linux/arm64 --push -t ghcr.io/thecodingmachine/nodejs:${TAG} -f Dockerfile.${VARIANT} .
fi
