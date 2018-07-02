[![Build Status](https://travis-ci.org/thecodingmachine/docker-images-nodejs.svg?branch=master)](https://travis-ci.org/thecodingmachine/docker-images-nodejs)

# General purpose NodeJS images for Docker

This repository contains a set of **fat**, developer-friendly, general purpose NodeJS images for Docker.
     
 - 2 variants available: `standalone` and `apache` (for serving an SPA without NodeJS server as backend)
 - Images are bundled with cron. Cron jobs can be configured using environment variables
 - Everything is done to limit file permission issues that often arise when using Docker. The image is actively tested on Linux, Windows and MacOS

## Images

| Name                                                                                                                                   | NodeJs version | variant    | Size                                                                                                                                                               |
|----------------------------------------------------------------------------------------------------------------------------------------|----------------|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [thecodingmachine/nodejs:6](https://github.com/thecodingmachine/docker-images-nodejs/blob/master/Dockerfile.6)                 | `6.x`          | standalone | [![](https://images.microbadger.com/badges/image/thecodingmachine/nodejs:6.svg)](https://microbadger.com/images/thecodingmachine/nodejs:6)                 |
| [thecodingmachine/nodejs:8](https://github.com/thecodingmachine/docker-images-nodejs/blob/master/Dockerfile.8)                 | `8.x`          | standalone | [![](https://images.microbadger.com/badges/image/thecodingmachine/nodejs:8.svg)](https://microbadger.com/images/thecodingmachine/nodejs:8)                 |
| [thecodingmachine/nodejs:10](https://github.com/thecodingmachine/docker-images-nodejs/blob/master/Dockerfile.10)               | `10.x`         | standalone | [![](https://images.microbadger.com/badges/image/thecodingmachine/nodejs:10.svg)](https://microbadger.com/images/thecodingmachine/nodejs:10)               |
| [thecodingmachine/nodejs:6-apache](https://github.com/thecodingmachine/docker-images-nodejs/blob/master/Dockerfile.6-apache)   | `6.x`          | apache     | [![](https://images.microbadger.com/badges/image/thecodingmachine/nodejs:6-apache.svg)](https://microbadger.com/images/thecodingmachine/nodejs:6-apache)   |
| [thecodingmachine/nodejs:8-apache](https://github.com/thecodingmachine/docker-images-nodejs/blob/master/Dockerfile.8-apache)   | `8.x`          | apache     | [![](https://images.microbadger.com/badges/image/thecodingmachine/nodejs:8-apache.svg)](https://microbadger.com/images/thecodingmachine/nodejs:8-apache)   |
| [thecodingmachine/nodejs:10-apache](https://github.com/thecodingmachine/docker-images-nodejs/blob/master/Dockerfile.10-apache) | `10.x`         | apache     | [![](https://images.microbadger.com/badges/image/thecodingmachine/nodejs:10-apache.svg)](https://microbadger.com/images/thecodingmachine/nodejs:10-apache) |

Note: we do not tag minor releases of NodeJS, only major versions. You will find for example an image for NodeJS 6.x, but no tagged image for NodeJS 6.9. 
This is because NodeJS follows SemVer and we believe you have no valid reason to ask explicitly for 6.1. 
When 6.2 is out, you certainly want to upgrade automatically to this minor release since it is backward compatible.

Images are automatically updated when a new patch version of NodeJS is released, so the NodeJS 6.x image will always contain 
the most up-to-date version of the NodeJS 6.x branch. If you want to automatically update your images on your production
environment, you can use tools like [watchtower](https://github.com/v2tec/watchtower) that will monitor new versions of
the images and update your environment on the fly.

## Usage

Example with standalone:

```bash
$ docker run -it --rm --name my-running-script -v "$PWD":/usr/src/app thecodingmachine/nodejs:10 node your-script.js
```

Example with Apache:

```bash
$ docker run -p 80:80 --name my-apache-app -v "$PWD":/var/www/html thecodingmachine/nodejs:10-apache
```

Example with Apache + Node 10.x in a Dockerfile:

**Dockerfile**
```Dockerfile
FROM thecodingmachine/nodejs:10-apache

COPY src/ /var/www/html/
RUN yarn install
RUN yarn run buld
```

## Default working directory

The working directory (the directory in which you should mount/copy your application) depends on the image variant
you are using:

| Variant | Working directory |
|---------|-------------------|
| standalone     | `/usr/src/app`    |
| apache  | `/var/www/html`   |


## Changing Apache document root

For the *apache* variant, you can change the document root of Apache (i.e. your "public" directory) by using the 
`APACHE_DOCUMENT_ROOT` variable:

```
# The root of your website is in the "public" directory:
APACHE_DOCUMENT_ROOT=public/
```

## Enabling/disabling Apache extensions

You can enable/disable Apache extensions using the `APACHE_EXTENSION_[extension_name]` environment variable.

For instance:

```yml
version: '3'
services:
  my_app:
    image: thecodingmachine/nodejs:10-apache
    environment:
      # Enable the DAV extension for Apache
      APACHE_EXTENSION_DAV: 1
      # Enable the SSL extension for Apache
      APACHE_EXTENSION_SSL: 1
```

As an alternative, you can use the `APACHE_EXTENSIONS` global variable:

```
APACHE_EXTENSIONS="dav ssl"
```

**Apache modules enabled by default:** access_compat, alias, auth_basic, authn_core, authn_file, authz_core, authz_host, authz_user, autoindex, deflate, dir, env, expires, filter, mime, mpm_prefork, negotiation, reqtimeout, rewrite, setenvif, status

**Apache modules available:** access_compat, actions, alias, allowmethods, asis, auth_basic, auth_digest, auth_form, authn_anon, authn_core, authn_dbd, authn_dbm, authn_file, authn_socache, authnz_fcgi, authnz_ldap, authz_core, authz_dbd, authz_dbm, authz_groupfile, authz_host, authz_owner, authz_user, autoindex, buffer, cache, cache_disk, cache_socache, cgi, cgid, charset_lite, data, dav, dav_fs, dav_lock, dbd, deflate, dialup, dir, dump_io, echo, env, ext_filter, file_cache, filter, headers, heartbeat, heartmonitor, ident, include, info, lbmethod_bybusyness, lbmethod_byrequests, lbmethod_bytraffic, lbmethod_heartbeat, ldap, log_debug, log_forensic, lua, macro, mime, mime_magic, mpm_event, mpm_prefork, mpm_worker, negotiation, proxy, proxy_ajp, proxy_balancer, proxy_connect, proxy_express, proxy_fcgi, proxy_fdpass, proxy_ftp, proxy_html, proxy_http, proxy_scgi, proxy_wstunnel, ratelimit, reflector, remoteip, reqtimeout, request, rewrite, sed, session, session_cookie, session_crypto, session_dbd, setenvif, slotmem_plain, slotmem_shm, socache_dbm, socache_memcache, socache_shmcb, speling, ssl, status, substitute, suexec, unique_id, userdir, usertrack, vhost_alias, xml2enc

## Permissions

Ever faced file permission issues with Docker? Good news, this is a thing of the past!

If you are used to running Docker containers with the base NodeJS image, you probably noticed that when running commands
(like `yarn install`) within the container, files are associated to the `root` user. This is because the base user
of the image is "root".

When you mount your project directory into `/var/www/html` or `/usr/src/app`, it would be great if the default user used by Docker could
be your current host user.

The problem with Docker is that the container and the host do not share the same list of users. For instance, you might
be logged in on your host computer as `superdev` (ID: 1000), and the container has no user whose ID is 1000.

The *thecodingmachine/nodejs* images solve this issue with a bit of black magic:

The image contains a user named `docker`. On container startup, the startup script will look at the owner of the 
working directory (`/var/www/html` for Apache, or `/usr/src/app` for standalone). The script will then assume that
you want to run commands as this user. So it will **dynamically change the ID of the docker user** to match the ID of
the current working directory user.

Furthermore, the image is changing the Apache default user/group to be `docker/docker` (instead if `www-data/www-data`).
So Apache will run with the same rights as the user on your host.

The direct result is that, in development:

 - Your NodeJS application can edit any file
 - Your container can edit any file
 - You can still edit any file created by Apache or by the container in CLI


## Setting up CRON jobs

You can set up CRON jobs using environment variables too.

To do this, you need to configure 3 variables:

```bash
# configure the user that will run cron (defaults to root)
CRON_USER=root
# configure the schedule for the cron job (here: run every minute)
CRON_SCHEDULE=* * * * * * *
# last but not least, configure the command
CRON_COMMAND=yarn run stuff
```

By default, CRON output will be redirected to Docker output.

If you have more than one job to run, you can suffix your environment variable with the same string. For instance:

```bash
CRON_USER_1=root
CRON_SCHEDULE_1=* * * * * * *
CRON_COMMAND_1=yarn run stuff

CRON_USER_2=www-data
CRON_SCHEDULE_2=* * * * * * *
CRON_COMMAND_2=yarn run other-stuff
```

**Important**: The cron runner we use is [Supercronic](https://github.com/aptible/supercronic) and not the orginial "cron" that has a number of issues with containers. 
Even with Supercronic, the architecture of cron was never designed with Docker in mind (Cron is way older than Docker). It will run correctly on
your container. If at some point you want to scale and add more containers, it will run on all your containers.
At that point, if you only want to run a Cron task once for your application (and not once per container), you might
want to have a look at alternative solutions like [Tasker](https://github.com/opsxcq/tasker) or one of the many
other alternatives.

## Launching commands on container startup

You can launch commands on container startup using the `STARTUP_COMMAND_XXX` environment variables.
This can be very helpful to install dependencies or apply database patches for instance:

```bash
STARTUP_COMMAND_1=yarn install
STARTUP_COMMAND_2=yarn run watch &
```

As an alternative, the images will look into the container for an executable file named `/etc/container/startup.sh`.

If such a file is mounted in the image, it will be executed on container startup.

```bash
docker run -it --rm --name my-running-script -v "$PWD":/usr/src/myapp -w /usr/src/myapp \ 
       -v $PWD/my-startup-script.sh:/etc/container/startup.sh thecodingmachine/nodejs:10 node your-script.js 
```

## Registering SSH private keys

If your NodeJS project as a dependency on [a package stored in a private GIT repository](https://getcomposer.org/doc/05-repositories.md#using-private-repositories), 
your `yarn install` commands will not work unless you register your private key in the container.

You have several options to do this.

### Option 1: mount your keys in the container directly

This option is the easiest way to go if you are using the image on a development environment.

**docker-compose.yml**
```yml
version: '3'
services:
  my_app:
    image: thecodingmachine/nodejs:10
    volumes:
      - ~/.ssh:/home/docker/.ssh
```

### Option 2: store the keys from environment variables or build arguments

Look at this option if you are building a Dockerfile from this image.

The first thing to do is to get the signature of the server you want to connect to.

``` bash
$ ssh-keyscan myserver.com
```

Copy the output and put it in an environment variable. We assume the content is stored in `$SSH_KNOWN_HOSTS`.

Now, let's write a Dockerfile.

**Dockerfile**
```yml
FROM thecodingmachine/nodejs:node1°

ARG SSH_PRIVATE_KEY
ARG SSH_KNOWN_HOSTS

# Let's register the private key
RUN ssh-add <(echo "$SSH_PRIVATE_KEY")
# Let's add the server to the list of known hosts.
RUN echo "$SSH_KNOWN_HOSTS" >> ~/.ssh/known_hosts
```

Finally, when triggering the build, you must pass the 2 variables as [build arguments](https://docs.docker.com/engine/reference/commandline/build/#set-build-time-variables-build-arg):

```bash
$ docker build -t my_image --build-arg SSH_PRIVATE_KEY="$SSH_PRIVATE_KEY" --build-arg SSH_KNOWN_HOSTS="$SSH_KNOWN_HOSTS" .
```

## Usage in Kubernetes

If you plan to use this image in Kubernetes, please be aware that the image internally uses `sudo`. This is because the
default user (`docker`) needs to be able to edit NodeJS config files as `root`.

Kubernetes has a security setting (`allowPrivilegeEscalation`) that can disallow the use of `sudo`. The use of this flag
breaks the image and in the logs, you will find the message:

```
sudo: effective uid is not 0, is /usr/bin/sudo on a file system with the 'nosuid' option set or an NFS file system without root privileges?
```

Please be sure that this option is never set to false:

```yml
apiVersion: v1
kind: Pod
# ...
spec:
  containers:
  - name: foobar
    image: thecodingmachine/nodejs:10
    securityContext:
      allowPrivilegeEscalation: true # never use "false" here.
```

## Contributing

The Dockerfiles are generated from a template using [Orbit](https://github.com/gulien/orbit).

If you want to modify a Dockerfile you should instead edit the `utils/Dockerfile.blueprint`and then run the command:

```bash
$ orbit run generate
```

This command will generate all the files from the "blueprint" templates.

You can then test your changes using the `build-and-test.sh` command:

```bash
BRANCH=master VARIANT=10 ./build-and-test.sh
```