import {ORPCError, os} from '@orpc/server';
import {z} from 'zod';
import {CURRENCIES} from '@/constants.js';
import {supabaseMiddleware} from '@/supabase-client.js';

export const listing = os
  .input(z.uuid())
  .use(supabaseMiddleware)
  .handler(async ({input: list_id, context}) => {
    const {data} = await context.supabase
      .from('items')
      .select('*')
      .order('order', {ascending: true, nullsFirst: true})
      .order('created_at', {ascending: false})
      .eq('list_id', list_id)
      .throwOnError();

    return data;
  });

export const create = os
  .input(
    z
      .object({
        title: z
          .string()
          .max(100)
          .nullish()
          .transform((v) => v?.trim() ?? ''),
        price: z.number().min(0).nullish().default(null),
        currency: z.enum(CURRENCIES).or(z.literal('')),
        date: z
          .string()
          // eslint-disable-next-line unicorn/prefer-number-properties
          .refine((date) => !isNaN(Date.parse(date)), {
            message: 'Invalid date',
          })
          .nullish()
          .default(null),
        list_id: z.uuid(),
      })
      .array(),
  )
  .use(supabaseMiddleware)
  .handler(async ({input, context}) => {
    await context.supabase.from('items').insert(input).throwOnError();
  });

export const update = os
  .input(
    z
      .object({
        id: z.uuid(),
        title: z.string().max(100).optional(),
        price: z.number().min(0).nullable().optional(),
        currency: z.enum(CURRENCIES).or(z.literal('')).optional(),
        date: z
          .string()
          // eslint-disable-next-line unicorn/prefer-number-properties
          .refine((date) => !isNaN(Date.parse(date)), {
            message: 'Invalid date',
          })
          .nullable()
          .optional(),
        is_completed: z.boolean().optional(),
        order: z.number().nullable().optional(),
        list_id: z.uuid(),
      })
      .array(),
  )
  .use(supabaseMiddleware)
  .handler(async ({input, context}) => {
    await context.supabase.from('items').upsert(input).throwOnError();
  });

export const remove = os
  .input(z.uuid().array())
  .use(supabaseMiddleware)
  .handler(async ({input, context}) => {
    await context.supabase
      .from('items')
      .delete()
      .in('id', input)
      .throwOnError();
  });
