import type {RouterClient} from '@orpc/server';
import * as auth from './auth.js';
import * as lists from './lists/index.js';

export const router = {
  auth: {
    signIn: auth.signIn,
    me: auth.me,
  },
  lists: {
    listing: lists.listing,
    sync: lists.sync,
  },
};

export type Router = typeof router;
export type OrpcClient = RouterClient<Router>;
