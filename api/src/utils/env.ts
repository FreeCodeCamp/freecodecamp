import assert from 'node:assert';
import path from 'node:path';
import { config } from 'dotenv';
import { LogLevel } from 'fastify';

const envPath = path.resolve(__dirname, '../../../.env');
const { error } = config({ path: envPath });

if (error && process.env.FREECODECAMP_NODE_ENV !== 'production') {
  console.warn(`
  ----------------------------------------------------
  Warning: .env file not found.
  ----------------------------------------------------
  Please copy sample.env to .env

  You can ignore this warning if using a different way
  to setup this environment.
  ----------------------------------------------------
  `);
}

function isAllowedEnv(env: string): env is 'development' | 'production' {
  return ['development', 'production'].includes(env);
}

const _EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'ses';
const _FREECODECAMP_NODE_ENV =
  process.env.FREECODECAMP_NODE_ENV || 'production';

function isAllowedProvider(provider: string): provider is 'ses' | 'nodemailer' {
  return ['ses', 'nodemailer'].includes(provider);
}

function createTestConnectionURL(url: string, dbId?: string) {
  assert.notEqual(
    _FREECODECAMP_NODE_ENV,
    'production',
    "The database URL can't be modified in production."
  );
  assert.ok(
    dbId,
    `dbId is required for test connection URL. Is this running in a test environment?
If so, ensure that the environment variable JEST_WORKER_ID is set.`
  );
  return url.replace(/(.*)(\?.*)/, `$1${dbId}$2`);
}

assert.ok(process.env.HOME_LOCATION);
assert.ok(isAllowedEnv(_FREECODECAMP_NODE_ENV));
assert.ok(isAllowedProvider(_EMAIL_PROVIDER));
assert.ok(process.env.AUTH0_CLIENT_ID);
assert.ok(process.env.AUTH0_CLIENT_SECRET);
assert.ok(process.env.AUTH0_DOMAIN);
assert.ok(process.env.API_LOCATION);
assert.ok(process.env.JWT_SECRET);
assert.ok(process.env.STRIPE_SECRET_KEY);
assert.ok(process.env.MONGOHQ_URL);
assert.ok(process.env.COOKIE_SECRET);

const LOG_LEVELS: LogLevel[] = [
  'fatal',
  'error',
  'warn',
  'info',
  'debug',
  'trace',
  'silent'
] as const;

function isLogLevel(level: string): level is LogLevel {
  return LOG_LEVELS.includes(level);
}

const _FCC_API_LOG_LEVEL = process.env.FCC_API_LOG_LEVEL || 'info';

assert.ok(
  isLogLevel(_FCC_API_LOG_LEVEL),
  `FCC_API_LOG_LEVEL must be one of ${LOG_LEVELS.join(', ')}. Found ${_FCC_API_LOG_LEVEL}`
);

if (process.env.FREECODECAMP_NODE_ENV !== 'development') {
  assert.ok(process.env.SES_ID);
  assert.ok(process.env.SES_SECRET);
  assert.notEqual(
    process.env.SES_SECRET,
    'ses_secret_from_aws',
    'The SES secret should be changed from the default value.'
  );
  assert.ok(process.env.COOKIE_DOMAIN);
  assert.notEqual(process.env.COOKIE_SECRET, 'a_cookie_secret');
  assert.ok(process.env.SENTRY_DSN);
  assert.ok(process.env.SENTRY_ENVIRONMENT);
  // The following values can exist in development, but production-like
  // environments need to override the defaults.
  assert.notEqual(
    process.env.SENTRY_DSN,
    'dsn_from_sentry_dashboard',
    `The DSN from Sentry's dashboard should be used.`
  );
  assert.notEqual(
    process.env.SENTRY_ENVIRONMENT,
    'development',
    `The Sentry environment should be changed from the default.`
  );
  assert.notEqual(
    process.env.JWT_SECRET,
    'a_jwt_secret',
    'The JWT secret should be changed from the default value.'
  );
  assert.ok(
    process.env.FCC_ENABLE_DEV_LOGIN_MODE !== 'true',
    'Dev login mode MUST be disabled in production.'
  );
  assert.ok(
    process.env.EMAIL_PROVIDER === 'ses',
    'SES MUST be used in production.'
  );
  assert.notEqual(
    process.env.STRIPE_SECRET_KEY,
    'sk_from_stripe_dashboard',
    'The Stripe secret should be changed from the default value.'
  );
  assert.notEqual(process.env.NODE_ENV, 'test');
  assert.notEqual(
    process.env.AUTH0_CLIENT_SECRET,
    'client_secret_from_auth0_dashboard',
    'The Auth0 client secret should be changed from the default value.'
  );
  assert.notEqual(
    process.env.GROWTHBOOK_FASTIFY_API_HOST,
    'fastify_api_sdk_api_host_from_growthbook_dashboard',
    'The GROWTHBOOK_FASTIFY_API_HOST env should be changed from the default value.'
  );
  assert.notEqual(
    process.env.GROWTHBOOK_FASTIFY_CLIENT_KEY,
    'fastify_api_sdk_client_key_from_growthbook_dashboard',
    'The GROWTHBOOK_FASTIFY_CLIENT_KEY env should be changed from the default value.'
  );
}

export const HOME_LOCATION = process.env.HOME_LOCATION;
// Mailhog is used in development and test environments, hence the localhost
// default.
export const MAILHOG_HOST = process.env.MAILHOG_HOST ?? 'localhost';
export const MONGOHQ_URL =
  process.env.NODE_ENV === 'test'
    ? createTestConnectionURL(
        process.env.MONGOHQ_URL,
        process.env.JEST_WORKER_ID
      )
    : process.env.MONGOHQ_URL;

export const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
export const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
export const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
export const EMAIL_PROVIDER = _EMAIL_PROVIDER;
export const PORT = process.env.PORT || '3000';
// HOST defaults to 0.0.0.0 because the server is intended to be used in a
// container.
export const HOST = process.env.HOST || '0.0.0.0';
export const API_LOCATION = process.env.API_LOCATION;
export const FCC_ENABLE_SWAGGER_UI = undefinedOrBool(
  process.env.FCC_ENABLE_SWAGGER_UI
);
export const FCC_ENABLE_DEV_LOGIN_MODE =
  process.env.FCC_ENABLE_DEV_LOGIN_MODE === 'true';
export const FCC_API_LOG_LEVEL = _FCC_API_LOG_LEVEL;
export const FCC_ENABLE_SHADOW_CAPTURE = undefinedOrBool(
  process.env.FCC_ENABLE_SHADOW_CAPTURE
);
export const FCC_ENABLE_EXAM_ENVIRONMENT = undefinedOrBool(
  process.env.FCC_ENABLE_EXAM_ENVIRONMENT
);
export const FCC_ENABLE_SENTRY_ROUTES = undefinedOrBool(
  process.env.FCC_ENABLE_SENTRY_ROUTES
);
export const FREECODECAMP_NODE_ENV = _FREECODECAMP_NODE_ENV;
export const SENTRY_DSN =
  process.env.SENTRY_DSN === 'dsn_from_sentry_dashboard'
    ? ''
    : process.env.SENTRY_DSN;
export const SENTRY_ENVIRONMENT =
  process.env.SENTRY_ENVIRONMENT === 'development'
    ? ''
    : process.env.SENTRY_ENVIRONMENT;
export const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN;
export const COOKIE_SECRET = process.env.COOKIE_SECRET;
export const JWT_SECRET = process.env.JWT_SECRET;
export const SES_ID = process.env.SES_ID;
export const SES_SECRET = process.env.SES_SECRET;
export const SES_REGION = process.env.SES_REGION || 'us-east-1';
export const SHOW_UPCOMING_CHANGES =
  process.env.SHOW_UPCOMING_CHANGES === 'true';
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const GROWTHBOOK_FASTIFY_API_HOST =
  process.env.GROWTHBOOK_FASTIFY_API_HOST;
export const GROWTHBOOK_FASTIFY_CLIENT_KEY =
  process.env.GROWTHBOOK_FASTIFY_CLIENT_KEY;

function undefinedOrBool(val: string | undefined): undefined | boolean {
  if (!val) {
    return undefined;
  }

  return val === 'true';
}
