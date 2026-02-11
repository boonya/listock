import {keepPreviousData, queryOptions} from '@tanstack/react-query';
import {getAPIClient} from '@/providers/api-client';
import type {Session} from '@/providers/auth/session';

export const queryRefreshSession = (session: Session) => {
  return queryOptions({
    queryKey: ['refresh-session'],
    queryFn: async () => {
      const api = getAPIClient(API_URL, session);
      return api.user.refresh_session(session);
    },
    placeholderData: keepPreviousData,
    initialData: session,
    staleTime: session.ttl * 1000,
    initialDataUpdatedAt: session.issued_at * 1000,
  });
};
