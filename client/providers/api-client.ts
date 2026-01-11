import type {OrpcClient} from '@listock/server/router';
import {createORPCClient} from '@orpc/client';
import {RPCLink} from '@orpc/client/fetch';

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
