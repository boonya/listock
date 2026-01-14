import type {RouterClient} from '@orpc/server';
import auth from './auth.js';
import lists from './lists/index.js';

export const router = {
  auth,
  lists,
};

export type Router = typeof router;
export type OrpcClient = RouterClient<Router>;
