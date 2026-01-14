import {z} from 'zod';

const EnvsSchema = z.object({
  REVISION: z.string().trim().min(3),
  HOSTNAME: z.string().default('localhost'),
  PORT: z.coerce.number().min(1024).max(65_535).default(31_235),
  SUPABASE_URL: z.url(),
  SUPABASE_ANON_KEY: z.string().nonempty(),
});

export type Envs = z.infer<typeof EnvsSchema>;

export default function getEnvs() {
  return EnvsSchema.parse(process.env);
}
