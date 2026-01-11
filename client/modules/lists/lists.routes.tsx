import {createRoute, redirect} from '@tanstack/react-router';
// import ListItems from '@/modules/list-items';
import Lists from '@/modules/lists';
import {sessionQueries} from '@/providers/query-client/session';
import rootRoute from '@/providers/router/root.route';

export const root = createRoute({
  path: '/lists',
  getParentRoute: () => rootRoute,
  beforeLoad: async ({location, context}) => {
    const session = await context.queryClient.fetchQuery(
      sessionQueries.current(),
    );
    if (!session) {
      throw redirect({
        to: '/sign-in',
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect_to: location.href,
        },
      });
    }
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
