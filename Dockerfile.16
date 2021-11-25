FROM debian:stretch-slim

LABEL authors="Julien Neuhart <j.neuhart@thecodingmachine.com>, David Négrier <d.negrier@thecodingmachine.com>"

# |--------------------------------------------------------------------------
# | Required libraries
# |--------------------------------------------------------------------------
# |
# | Installs required libraries.
# |

RUN apt-get update &&\
    apt-get install -y --no-install-recommends curl git nano sudo ca-certificates procps libfontconfig --no-install-recommends

# |--------------------------------------------------------------------------
# | Supercronic
# |--------------------------------------------------------------------------
# |
# | Supercronic is a drop-in replacement for cron (for containers).
# |

RUN SUPERCRONIC_URL=https://github.com/aptible/supercronic/releases/download/v0.1.5/supercronic-linux-amd64 \
 && SUPERCRONIC=supercronic-linux-amd64 \
 && SUPERCRONIC_SHA1SUM=9aeb41e00cc7b71d30d33c57a2333f2c2581a201 \
 && curl -fsSLO "$SUPERCRONIC_URL" \
 && echo "${SUPERCRONIC_SHA1SUM}  ${SUPERCRONIC}" | sha1sum -c - \
 && chmod +x "$SUPERCRONIC" \
 && mv "$SUPERCRONIC" "/usr/local/bin/${SUPERCRONIC}" \
 && ln -s "/usr/local/bin/${SUPERCRONIC}" /usr/local/bin/supercronic

 # |--------------------------------------------------------------------------
 # | User
 # |--------------------------------------------------------------------------
 # |
 # | Define a default user with sudo rights.
 # |

 RUN useradd -ms /bin/bash docker && adduser docker sudo
 # Users in the sudoers group can sudo as root without password.
 RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers




# |--------------------------------------------------------------------------
# | NodeJS
# |--------------------------------------------------------------------------
# |
# | Installs NodeJS and npm.
# |

RUN apt-get update &&\
    apt-get install -y --no-install-recommends gnupg &&\
    curl -sL https://deb.nodesource.com/setup_16.x | bash - &&\
    apt-get update &&\
    apt-get install -y --no-install-recommends nodejs

# |--------------------------------------------------------------------------
# | yarn
# |--------------------------------------------------------------------------
# |
# | Installs yarn. It provides some nice improvements over npm.
# |

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - &&\
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list &&\
    apt-get update &&\
    apt-get install -y --no-install-recommends yarn

# |--------------------------------------------------------------------------
# | PATH updating
# |--------------------------------------------------------------------------
# |
# | Let's add ./node_modules/.bin to the PATH (utility function to use NPM bin easily)
# |

ENV PATH="$PATH:./node_modules/.bin"
RUN sed -i 's#/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin#/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:./node_modules/.bin#g' /etc/sudoers

USER docker
# |--------------------------------------------------------------------------
# | SSH client
# |--------------------------------------------------------------------------
# |
# | Let's set-up the SSH client (for connections to private git repositories)
# | We create an empty known_host file and we launch the ssh-agent
# |

RUN mkdir ~/.ssh && touch ~/.ssh/known_hosts && chmod 644 ~/.ssh/known_hosts && eval $(ssh-agent -s)

# |--------------------------------------------------------------------------
# | .bashrc updating
# |--------------------------------------------------------------------------
# |
# | Let's update the .bashrc to add nice aliases
# |
RUN { \
        echo "alias ls='ls --color=auto'"; \
        echo "alias ll='ls --color=auto -alF'"; \
        echo "alias la='ls --color=auto -A'"; \
        echo "alias l='ls --color=auto -CF'"; \
    } >> ~/.bashrc

USER root


# |--------------------------------------------------------------------------
# | Entrypoint
# |--------------------------------------------------------------------------
# |
# | Defines the entrypoint.
# |

ENV NODE_VERSION=16.x


RUN mkdir -p /usr/src/app && chown docker:docker /usr/src/app
WORKDIR /usr/src/app


# Add Tini (to be able to stop the container with ctrl-c.
# See: https://github.com/krallin/tini
ENV TINI_VERSION v0.16.1
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

COPY utils/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
COPY utils/docker-entrypoint-as-root.sh /usr/local/bin/docker-entrypoint-as-root.sh
COPY utils/startup_commands.js /usr/local/bin/startup_commands.js
COPY utils/generate_cron.js /usr/local/bin/generate_cron.js


CMD [ "node" ]




ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

USER docker