// We need to use the triple-slash directive to ensure that ts-node uses the
// reset.d.ts file. It's not possible to import the file directly because it
// is not included in the build (it's a dev dependency).
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./reset.d.ts" />
import { randomBytes } from 'crypto';
import { FastifyRequest } from 'fastify';
import { build } from './app';
import {
  FREECODECAMP_NODE_ENV,
  FCC_API_LOG_LEVEL,
  HOST,
  PORT
} from './utils/env';

const requestSerializer = (request: FastifyRequest) => ({
  method: request.method,
  url: request.url,
  ip: request.headers['x-forwarded-for']?.toString() || request.ip,
  hostname: request.hostname,
  remoteAddress: request.headers['x-forwarded-for']?.toString() || request.ip,
  remotePort: request.socket.remotePort
});

const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        singleLine: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    },
    level: FCC_API_LOG_LEVEL || 'info',
    serializers: {
      req: requestSerializer
    }
  },
  production: {
    level: FCC_API_LOG_LEVEL || 'info',
    serializers: {
      req: requestSerializer
    }
  }
};

const start = async () => {
  const fastify = await build({
    logger: envToLogger[FREECODECAMP_NODE_ENV] ?? true,
    genReqId: () => randomBytes(8).toString('hex'),
    disableRequestLogging: true
    // trustProxy: true // Trust X-Forwarded-* headers
  });
  try {
    const port = Number(PORT);
    fastify.log.info(`Starting server on port ${port}`);
    await fastify.listen({ port, host: HOST });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

void start();
