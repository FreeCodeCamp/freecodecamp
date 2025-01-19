FROM node:20-bookworm AS builder

# Install jq and pnpm globally
RUN apt-get update && apt-get install -y jq && rm -rf /var/lib/apt/lists/* \
    && npm i -g pnpm@9
# global installs need root permissions, so have to happen before we switch to the node user

# node images create a non-root user that we can use
USER node
WORKDIR /home/node/build

# Copy project files
COPY --chown=node:node . /home/node/build/


# While we want to ignore scripts generally, we do need to generate the prisma
# client. Note: npx is the simplest way to generate the client without us having
# to have prisma as a prod dependency. The jq tricks are to ensure we're using
# the right version of prisma.
RUN pnpm config set dedupe-peer-dependents false && \
    pnpm install -F=api -F=curriculum -F=tools/scripts/build -F=challenge-parser --frozen-lockfile --ignore-scripts

RUN cd api && npx prisma@$(jq -r '.devDependencies.prisma' < package.json) generate

# The api needs to source curriculum.json and build:curriculum relies on the
# following env vars.
ARG SHOW_UPCOMING_CHANGES=false
ENV SHOW_UPCOMING_CHANGES=$SHOW_UPCOMING_CHANGES

RUN pnpm build:curriculum && pnpm -F=api build

FROM node:20-bookworm AS deps

# Install jq (once per build)
RUN apt-get update && apt-get install -y jq && rm -rf /var/lib/apt/lists/*

WORKDIR /home/node/build

# Copy pnpm.yaml and necessary files
COPY --chown=node:node pnpm*.yaml .
COPY --chown=node:node api/ api/
COPY --chown=node:node shared/ shared/


RUN npm i -g pnpm@9

# Weirdly this config does not seem necessary for the new api (the same number
# of deps are installed in both cases), but I'm including it just for
# consistency.
RUN pnpm config set dedupe-peer-dependents false && \
    pnpm install --prod --ignore-scripts -F=shared -F=api --frozen-lockfile

RUN cd api && npx prisma@$(jq -r '.devDependencies.prisma' < package.json) generate

FROM node:20-bookworm

USER node
WORKDIR /home/node/fcc

COPY --from=builder --chown=node:node /home/node/build/api/dist/ ./
COPY --from=builder --chown=node:node /home/node/build/api/package.json api/
COPY --from=builder --chown=node:node /home/node/build/shared/config/curriculum.json shared/config/

COPY --from=deps --chown=node:node /home/node/build/node_modules/ node_modules/
COPY --from=deps --chown=node:node /home/node/build/shared/node_modules/ shared/node_modules/
COPY --from=deps --chown=node:node /home/node/build/api/node_modules/ api/node_modules/

CMD ["node", "api/src/server.js"]