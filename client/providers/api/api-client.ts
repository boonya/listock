import type {OrpcClient} from '@listock/server/router';
import {createORPCClient} from '@orpc/client';
import {RPCLink} from '@orpc/client/fetch';
import pkg from '@/package.json';
import {useSession} from '@/providers/auth/session';
import {logger} from '@/utils/logger';

export type {OrpcClient as ApiClient};

type Session = {
  token_type?: string;
  access_token: string;
};

const getAuthorizationHeader = (session?: Session | null) => {
  if (!session) return;
  const {token_type, access_token} = session;
  return [token_type, access_token].filter(Boolean).join(' ');
};

export const getAPIClient = (session?: Session | null): OrpcClient => {
  const link = new RPCLink({
    url: API_URL,
    headers: {
      authorization: getAuthorizationHeader(session),
      'x-api-client-name': pkg.name,
      'x-api-client-version': pkg.version,
      'x-api-client-revision': REVISION,
    },
    // // fetch: <-- provide fetch polyfill fetch if needed
    // interceptors: [
    //   onError((error) => {
    //     logger.error(['network'], 'API client error.', error);
    //   }),
    // ],
  });
  return createORPCClient(link);
};

export function useApiClient(): OrpcClient {
  const [session] = useSession();
  return getAPIClient(session);
}
