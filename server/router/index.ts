import type {RouterClient} from '@orpc/server';
import lists from './lists';
import ping from './ping';
import user from './user';

export const router = {
  ping,
  user,
  lists,
};

export type Router = typeof router;
export type OrpcClient = RouterClient<Router>;
