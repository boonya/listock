import {createRoute} from '@tanstack/react-router';
import {authOnlyRoute} from '@/modules/auth/auth.routes';
import List from '@/modules/lists/list';
import Listing from '@/modules/lists/listing';
import {queryListing} from '@/providers/api/lists';
import rootRoute from '@/providers/router/root.route';
import {logger} from '@/utils/logger';

export const root = createRoute({
  path: '/lists',
  getParentRoute: () => rootRoute,
  beforeLoad: async ({context, location}) => {
    await authOnlyRoute(context.queryClient, location.href);
  },
  loader: async ({context}) => {
    // FIXME: Remove. This is just an experiment.
    const listing = await context.queryClient.fetchQuery(queryListing());
    logger.debug(['lists'], 'Got a listing.', listing);
  },
});

export const lists = createRoute({
  path: '/',
  getParentRoute: () => root,
  component: Listing,
});

export const list = createRoute({
  path: '/$id',
  getParentRoute: () => root,
  component: List,
});

export default root.addChildren([lists, list]);
