import { type FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox';

/**
 * Plugin for the health check endpoint.
 *
 * @param fastify The Fastify instance.
 * @param _options Options passed to the plugin via `fastify.register(plugin,
 * options)`.
 * @param done The callback to signal that the plugin is ready.
 */
export const statusRoute: FastifyPluginCallbackTypebox = (
  fastify,
  _options,
  done
) => {
  fastify.get('/status/ping', async (req, _reply) => {
    const url = req.url || 'URL not found';
    const reqId = req.id || 'REQ_ID not found';
    const headers = req.headers || 'HEADERS not found';
    const ip =
      req.headers['x-forwarded-for'] ||
      req.headers['x-real-ip'] ||
      req.ip ||
      'IP not found';
    const params = req.params || 'PARAMS not found';

    fastify.log
      .child({
        URL: url,
        REQ_ID: reqId,
        HEADERS: headers,
        IP: ip,
        PARAMS: params
      })
      .debug('returning a ping');
    return { msg: 'pong' };
  });

  done();
};
