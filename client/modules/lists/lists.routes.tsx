import {createRoute} from '@tanstack/react-router';
import {authOnlyRoute} from '@/modules/auth/auth.routes';
// import ListItems from '@/modules/list-items';
import Lists from '@/modules/lists';
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
  component: Lists,
});

// export const list = createRoute({
//   path: '/$id',
//   getParentRoute: () => root,
//   component: ListItems,
// });

export default root.addChildren([lists /**, list */]);
