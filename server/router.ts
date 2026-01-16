import type {RouterClient} from '@orpc/server';
import auth from '@/auth';
import lists from '@/lists';

export const router = {
  auth,
  lists,
};

export type Router = typeof router;
export type OrpcClient = RouterClient<Router>;
