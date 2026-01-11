import type {Database} from '@listock/supabase/database.d.ts';
import {os} from '@orpc/server';
import {createClient} from '@supabase/supabase-js';
import getEnvs from '@/env.js';
import type {ORPCContext} from '@/types/index.js';

type Options = Parameters<typeof createClient>[2];

export type SupabaseClient = ReturnType<typeof createSupabaseClient>;

const createSupabaseClient = (options?: Options) => {
  const {SUPABASE_URL, SUPABASE_ANON_KEY} = getEnvs();
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, options);
};

export default createSupabaseClient;

export const supabaseMiddleware = os
  .$context<ORPCContext>()
  .middleware(async ({context, next}) => {
    const access_token =
      context.reqHeaders?.get('authorization')?.match(/Bearer (.+)/i)?.[1] ||
      null;
    const supabase = createSupabaseClient({
      // accessToken: async () => context.jwt || null,
      accessToken: async () => access_token,
      // auth: {
      //   persistSession: false,
      // },
    });

    const result = await next({
      context: {
        supabase,
      },
    });

    return result;
  });
