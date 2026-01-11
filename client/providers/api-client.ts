import type {OrpcClient} from '@listock/server/router';
import {createORPCClient} from '@orpc/client';
import {RPCLink} from '@orpc/client/fetch';
import {createTanstackQueryUtils} from '@orpc/tanstack-query';
import {queryOptions, useSuspenseQuery} from '@tanstack/react-query';
import {sessionQueries} from '@/providers/query-client/session';

export type {OrpcClient as ApiClient};

export const getAPIClient = (accessToken?: string): OrpcClient => {
  const link = new RPCLink({
    url: API_URL,
    headers: {
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
    // // fetch: <-- provide fetch polyfill fetch if needed
    // interceptors: [
    //   onError((error) => {
    //     console.error(error);
    //   }),
    // ],
  });
  return createORPCClient(link);
};

export function useAPIClient() {
  return useSuspenseQuery(
    queryOptions({
      ...sessionQueries.current(),
      select: (session) => getAPIClient(session?.access_token),
    }),
  );
}

export const createAPIQuery = (accessToken?: string) => {
  const client = getAPIClient(accessToken);
  return createTanstackQueryUtils(client);
};
