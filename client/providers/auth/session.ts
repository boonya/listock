import {queryOptions, useQuery} from '@tanstack/react-query';
import {useLayoutEffect, useMemo} from 'react';
import {useLocalStorage} from 'usehooks-ts';
import {z} from 'zod';
import {getAPIClient} from '@/providers/api/api-client';
import {logger} from '@/utils/logger';

const UserSchema = z.object({
  id: z.uuid(),
  email: z.email().optional(),
  phone: z.string().optional(),
  role: z.string().optional(),
  created_at: z.string(),
  confirmed_at: z.string(),
  email_confirmed_at: z.string(),
  last_sign_in_at: z.string(),
  updated_at: z.string().optional(),
  is_anonymous: z.boolean(),
  user_metadata: z.object({}).loose(),
});

/**
 * node_modules/@supabase/auth-js/src/lib/types.ts
 */
const SessionSchema = z.object({
  token_type: z.literal('bearer'),
  /**
   * The access token jwt. It is recommended to set the JWT_EXPIRY to a shorter expiry value.
   */
  access_token: z.string(),
  /**
   * Timestamp the token was issued.
   */
  issued_at: z.number(),
  /**
   * A timestamp of when the token will expire. Returned when a login is confirmed.
   */
  expires_at: z.number(),
  /**
   * Number of seconds the token is going to be valid since it's issued.
   */
  ttl: z.number(),
  /**
   * A one-time used refresh token that never expires.
   */
  refresh_token: z.string(),
  user: UserSchema,
});

export type Session = z.infer<typeof SessionSchema>;

const STORAGE_KEY = 'session';

const deserializeSession = (value: string | null | undefined) => {
  try {
    const object = value && JSON.parse(value);
    if (!object) return null;
    return SessionSchema.parse(object);
  } catch (error) {
    logger.error(
      ['storage', 'auth'],
      'Failed to get session from storage.',
      error,
    );
    return null;
  }
};

const serializeSession = (session: Session | null | undefined) => {
  try {
    const value = SessionSchema.parse(session);
    return JSON.stringify(value);
  } catch (error) {
    logger.error(
      ['storage', 'auth'],
      'Failed to put session into a storage.',
      error,
    );
  }
  return '';
};

export function useSession() {
  const [session, set, remove] = useLocalStorage(STORAGE_KEY, null, {
    deserializer: deserializeSession,
    serializer: serializeSession,
  });

  return useMemo(
    () => [session, {set, remove}] as const,
    [session, set, remove],
  );
}

export const getSession = (): Session | null => {
  return deserializeSession(localStorage.getItem(STORAGE_KEY));
};

export const setSession = (session: Session | null | undefined) => {
  try {
    localStorage.setItem(STORAGE_KEY, serializeSession(session));
    /**
     * @link https://github.com/juliencrn/usehooks-ts/blob/61949134144d3690fe9f521260a16c779a6d3797/packages/usehooks-ts/src/useLocalStorage/useLocalStorage.ts#L141
     */
    window.dispatchEvent(new StorageEvent('local-storage', {key: STORAGE_KEY}));
  } catch (error) {
    logger.error(
      ['storage', 'auth'],
      'Failed to put session into a storage.',
      error,
    );
  }
};

export const removeSession = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    /**
     * @link https://github.com/juliencrn/usehooks-ts/blob/61949134144d3690fe9f521260a16c779a6d3797/packages/usehooks-ts/src/useLocalStorage/useLocalStorage.ts#L141
     */
    window.dispatchEvent(new StorageEvent('local-storage', {key: STORAGE_KEY}));
  } catch (error) {
    logger.error(
      ['storage', 'auth'],
      'Failed to remove session from storage.',
      error,
    );
  }
};

export const isSessionExpired = (session: Session | null) => {
  const expires_at = session?.expires_at;
  if (!expires_at) return true;
  return new Date(expires_at * 1000) < new Date();
};

export function SessionProvider() {
  const [session] = useSession();

  const enabled = !!session;
  const initialDataUpdatedAt = session ? session.issued_at * 1000 : undefined;
  const refetchInterval = session ? session.ttl * 1000 : undefined;

  useQuery(
    queryOptions({
      queryKey: ['refresh-session'],
      queryFn: async () => {
        const api = getAPIClient(session);
        const new_session = await api.auth.refresh_session({
          refresh_token: session!.refresh_token,
        });
        logger.debug(
          ['auth'],
          `New session retreived at ${new Date().toLocaleTimeString()}.`,
          new_session,
        );
        setSession(new_session);
        return new_session;
      },
      enabled,
      initialData: session,
      initialDataUpdatedAt,
      staleTime: refetchInterval,
      refetchInterval,
    }),
  );

  useLayoutEffect(() => {
    console.log(`session provider at ${new Date().toLocaleTimeString()}`, {
      'session issued_at':
        session?.issued_at &&
        new Date(session.issued_at * 1000).toLocaleString(),
      'session expires_at':
        session?.expires_at &&
        new Date(session.expires_at * 1000).toLocaleString(),
    });
  }, [session?.issued_at, session?.expires_at]);

  return null;
}
