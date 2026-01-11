import {getSession} from '@/providers/auth/session';

/**
 * // TODO: [session storage] -> so this one is going to be redundant
 *
 * @deprecated this one is going to be redundant since session stored in an syncronyous storage aka. localStorage
 */
export const sessionQueries = {
  current: () => ({
    queryKey: ['session'],
    queryFn: async () => (await getSession()) ?? null,
  }),
};
