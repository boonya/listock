import {queryOptions} from '@tanstack/react-query';
import {getAPIClient} from '@/providers/api-client';

export const queryPing = () =>
  queryOptions({
    queryKey: ['ping'],
    queryFn: () => {
      const api = getAPIClient(API_URL);
      return api.ping();
    },
  });
