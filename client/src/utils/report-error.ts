import * as Sentry from '@sentry/react';
import envData from '../../../config/env.json';

const { sentryClientDSN } = envData;

export function reportClientSideError(
  e: Error,
  message = sentryClientDSN === null
    ? 'Unhandled error'
    : 'Error sent to Sentry'
): string | void {
  return sentryClientDSN === null
    ? console.error(`Client: ${message}`, e)
    : Sentry.captureException(e);
}
