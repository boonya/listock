import {queryOptions} from '@tanstack/react-query';
import {getAPIClient} from '@/providers/api/api-client';
import {getSession} from '@/providers/auth/session';

export const queryListing = () =>
  queryOptions({
    queryKey: ['listing'],
    queryFn: async () => {
      const session = getSession();
      const api = getAPIClient(API_URL, session);
      return api.lists.listing();
    },
    staleTime: 0,
  });
