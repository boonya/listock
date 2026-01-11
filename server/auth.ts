import {ORPCError, os} from '@orpc/server';
import {z} from 'zod';
import createSupabaseClient, {supabaseMiddleware} from '@/supabase-client.js';
import type {ORPCContext} from '@/types/index.js';

export const signIn = os
  .input(
    z.object({
      email: z.email(),
      password: z.string().min(6),
    }),
  )
  .handler(async ({input}) => {
    try {
      const supabase = createSupabaseClient();
      const {data, error} = await supabase.auth.signInWithPassword(input);
      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      throw new ORPCError('INTERNAL_SERVER_ERROR', {cause: error});
    }
  });

export const me = os.$context<ORPCContext>().handler(async ({context}) => {
  try {
    const supabase = createSupabaseClient();
    const {data, error} = await supabase.auth.getUser(context.jwt);
    if (error) {
      throw new ORPCError('UNAUTHORIZED', {cause: error});
    }
    return data.user;
  } catch (error) {
    if (error instanceof ORPCError) throw error;
    throw new ORPCError('INTERNAL_SERVER_ERROR', {cause: error});
  }
});
