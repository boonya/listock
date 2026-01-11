import {ORPCError, os} from '@orpc/server';
import {z} from 'zod';
import {logger} from '@/logger.js';
import {supabaseMiddleware} from '@/supabase-client.js';
import {getDbApi} from './db-api.js';
import {sync as processSync} from './sync.js';

export const listing = os.use(supabaseMiddleware).handler(async ({context}) => {
  const db = getDbApi(context.supabase);
  return db.select();
  //   ...rest,
  //   created_at: new Date(created_at),
  // }));
});

export const sync = os
  .input(
    z
      .object({
        id: z.uuid().nullish().default(null),
        title: z.string(),
        // items: z.object({}).loose().array().nullish(),
        created_at: z.date(),
        updated_at: z.date().nullish().default(null),
        deleted_at: z.date().nullish().default(null),
      })
      .array(),
  )
  .use(supabaseMiddleware)
  .handler(async ({input, context}) => {
    const db = getDbApi(context.supabase);
    return processSync(db, input);
  });
