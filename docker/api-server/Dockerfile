FROM node:20-bookworm AS builder
# global installs need root permissions, so have to happen before we switch to
# the node user
RUN npm i -g pnpm@9
# node images create a non-root user that we can use
USER node
WORKDIR /home/node/build

COPY --chown=node:node *.* .
COPY --chown=node:node api-server/ api-server/
COPY --chown=node:node shared/ shared/
COPY --chown=node:node tools/ tools/
COPY --chown=node:node curriculum/ curriculum/
# TODO: AFAIK it's just the intro translations. Those should be folded into the
# curriculum and then we can remove this.
COPY --chown=node:node client/ client/

# We have to prevent pnpm from deduping peer dependencies because otherwise it
# will install all of the packages, not just api-server. Also, pnpm deploy is
# not useful since we need to install more than one package.

RUN pnpm config set dedupe-peer-dependents false && \
    pnpm -F=api-server -F=tools/scripts/build -F=challenge-parser -F=curriculum -F=shared \
    install --frozen-lockfile --ignore-scripts

# The api needs to source curriculum.json and build:curriculum relies on the
# following env vars.
ARG SHOW_UPCOMING_CHANGES=false
ENV SHOW_UPCOMING_CHANGES=$SHOW_UPCOMING_CHANGES
RUN pnpm build:curriculum && pnpm build:server

FROM node:20-bookworm AS deps

WORKDIR /home/node/build
COPY --chown=node:node pnpm*.yaml .
COPY --chown=node:node api-server/package.json api-server/package.json
COPY --chown=node:node shared/package.json shared/package.json

RUN npm i -g pnpm@9
# Prevent pnpm installing unnecessary packages (see above)
RUN pnpm config set dedupe-peer-dependents false && \
    pnpm -F=api-server -F=shared install --prod --ignore-scripts

FROM node:20-alpine
RUN npm i -g pm2@4
USER node
WORKDIR /home/node/fcc

COPY --from=builder --chown=node:node /home/node/build/api-server/ api-server/
COPY --from=builder --chown=node:node /home/node/build/shared/ shared/
COPY --from=builder --chown=node:node /home/node/build/package.json package.json
COPY --from=deps --chown=node:node /home/node/build/node_modules/ node_modules/

CMD ["pm2-runtime", "start", "api-server/ecosystem.config.js"]

