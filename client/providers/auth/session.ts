// import z from 'zod';

import type {Session as _Session} from '@supabase/supabase-js';
import {getSessionStorage} from '@/providers/storage/session';

// const UserSchema = z
//   .object({
//     id: z.uuid(),
//     email: z.email().optional(),
//     phone: z.string().optional(),
//     role: z.string().optional(),
//   })
//   .loose();

// /**
//  * node_modules/@supabase/auth-js/src/lib/types.ts
//  */
// const SessionSchema = z.object({
//   /**
//    * The oauth provider token. If present, this can be used to make external API requests to the oauth provider used.
//    */
//   provider_token: z.string().nullish().optional(),
//   /**
//    * The oauth provider refresh token. If present, this can be used to refresh the provider_token via the oauth provider's API. Not all oauth providers return a provider refresh token. If the provider_refresh_token is missing, please refer to the oauth provider's documentation for information on how to obtain the provider refresh token.
//    */
//   provider_refresh_token: z.string().nullish().optional(),
//   /**
//    * The access token jwt. It is recommended to set the JWT_EXPIRY to a shorter expiry value.
//    */
//   access_token: z.string(),
//   /**
//    * A one-time used refresh token that never expires.
//    */
//   refresh_token: z.string(),
//   /**
//    * The number of seconds until the token expires (since it was issued). Returned when a login is confirmed.
//    */
//   expires_in: z.number(),
//   /**
//    * A timestamp of when the token will expire. Returned when a login is confirmed.
//    */
//   expires_at: z.number().optional(),
//   token_type: z.string(),
//   user: UserSchema,
// });

// export type Session = z.infer<typeof SessionSchema>;
export type Session = _Session;

export const setSession = async (session: Session) => {
  try {
    const storage = getSessionStorage();
    await storage.put(session);
  } catch (error) {
    console.error('Failed to put session into a storage.', error);
  }
};

export const getSession = async () => {
  try {
    const storage = getSessionStorage();
    return storage.get();
  } catch (error) {
    console.error('Failed to get session from storage.', error);
    return undefined;
  }
};

export const removeSession = async () => {
  try {
    const storage = getSessionStorage();
    return storage.remove();
  } catch (error) {
    console.error('Failed to remove session from storage.', error);
    return undefined;
  }
};

export const getAccessToken = async () => {
  const session = await getSession();
  return session?.access_token;
};

export const isSessionExpired = async () => {
  const session = await getSession();
  const expires_at = session?.expires_at;
  if (!expires_at) return true;
  return new Date(expires_at * 1000) < new Date();
};
