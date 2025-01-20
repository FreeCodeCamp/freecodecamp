import type {
  FastifyPluginCallback,
  FastifyPluginAsync,
  FastifyRequest,
  RouteOptions
} from 'fastify';
import rateLimit, { type FastifyRateLimitStore } from '@fastify/rate-limit';
// @ts-expect-error - no types
import MongoStoreRL from 'rate-limit-mongo';
import isEmail from 'validator/lib/isEmail';

import { AUTH0_DOMAIN, MONGOHQ_URL } from '../../utils/env';
import { auth0Client } from '../../plugins/auth0';
import { createAccessToken } from '../../utils/tokens';
import { findOrCreateUser } from '../helpers/auth-helpers';

const getEmailFromAuth0 = async (
  req: FastifyRequest
): Promise<string | null> => {
  const auth0Res = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
    headers: {
      Authorization: req.headers.authorization ?? ''
    }
  });

  if (!auth0Res.ok) return null;

  // For now, we assume the response is a JSON object. If not, we can't proceed
  // and the only safe thing to do is to throw.
  const { email } = (await auth0Res.json()) as { email?: string };
  return typeof email === 'string' ? email : null;
};

// TODO: Use Redis! Then we don't need to maintain this store.
class Store implements FastifyRateLimitStore {
  mongoStore: MongoStoreRL;
  // We don't really need this.options, but it's here for consistency with the
  // custom store in the fastify-rate-limit docs.
  options: { timeWindow: number };
  constructor({ timeWindow }: { timeWindow: number }) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    this.mongoStore = new MongoStoreRL({
      collectionName: 'UserRateLimit',
      uri: MONGOHQ_URL,
      expireTimeMs: timeWindow // timeWindow is Fastify's equivalent of express-rate-limit's expireTimeMs
    });
    this.options = { timeWindow };
  }

  incr(
    key: string,
    cb: (err: Error | null, result?: { current: number; ttl: number }) => void
  ) {
    // This converts between what rate-limit-mongo calls and what
    // fastify-rate-limit expects
    const callbackConverted = (
      err: Error | null,
      current: number,
      expires: Date
    ) => {
      const ttl = expires.getTime() - Date.now();
      cb(err, { current, ttl });
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.mongoStore.incr(key, callbackConverted);
  }

  // routeOptions are ignored for now, but this is the signature we need to implement
  child(
    routeOptions: RouteOptions & { path: string; prefix: string }
  ): FastifyRateLimitStore {
    const childParams = { ...this.options, ...routeOptions };
    const store = new Store(childParams);
    return store;
  }
}

/**
 * Route handler for Mobile authentication.
 *
 * @param fastify The Fastify instance.
 * @param _options Options passed to the plugin via `fastify.register(plugin, options)`.
 *
 */
export const mobileAuth0Routes: FastifyPluginAsync = async (
  fastify,
  _options
) => {
  // Rate limit for mobile login
  // 10 requests per 15 minute windows
  // @ts-expect-error - no types
  await fastify.register(rateLimit, {
    timeWindow: 15 * 60 * 1000,
    max: 10,
    enableDraftSpec: true, // ratelimit-* instead of x-ratelimit-*
    keyGenerator: req => {
      const clientIp =
        (req.headers['x-forwarded-for'] as string) || 'localhost';
      fastify.log.debug({
        msg: 'Rate limit key generated',
        clientIp,
        directIp: req.ip,
        headers: {
          'x-forwarded-for': req.headers['x-forwarded-for'],
          'x-real-ip': req.headers['x-real-ip']
        }
      });
      return clientIp;
    },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    store: Store
  });

  // TODO(Post-MVP): move this into the app, so that we add this hook once for
  // all auth routes.
  fastify.addHook('onRequest', fastify.redirectIfSignedIn);

  fastify.get('/mobile-login', async (req, reply) => {
    fastify.log.debug({
      msg: 'Mobile login attempt',
      clientIp: req.headers['x-forwarded-for'] || req.ip,
      headers: {
        'x-forwarded-for': req.headers['x-forwarded-for'],
        'x-real-ip': req.headers['x-real-ip']
      }
    });

    const email = await getEmailFromAuth0(req);

    if (!email) {
      fastify.log.debug('Auth0 email fetch failed');
      return reply.status(401).send({
        message: 'We could not log you in, please try again in a moment.',
        type: 'danger'
      });
    }

    fastify.log.debug({ msg: 'Auth0 email received', email });

    if (!isEmail(email)) {
      fastify.log.debug({ msg: 'Invalid email format', email });
      return reply.status(400).send({
        message: 'The email is incorrectly formatted',
        type: 'danger'
      });
    }

    const { id } = await findOrCreateUser(fastify, email);
    fastify.log.debug({ msg: 'User found/created', userId: id, email });

    reply.setAccessTokenCookie(createAccessToken(id));
  });
};

/**
 * Route handler for authentication routes.
 *
 * @param fastify The Fastify instance.
 * @param _options Options passed to the plugin via `fastify.register(plugin, options)`.
 * @param done Callback to signal that the logic has completed.
 */
export const authRoutes: FastifyPluginCallback = (fastify, _options, done) => {
  // All routes are registered by the auth0 plugin, but we need an extra plugin
  // (this one) to encapsulate the auth0 decorators. Otherwise auth0OAuth will
  // be available globally.
  void fastify.register(auth0Client);
  done();
};
