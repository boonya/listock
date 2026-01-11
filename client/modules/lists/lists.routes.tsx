import {createRoute} from '@tanstack/react-router';
// import ListItems from '@/modules/list-items';
import Lists from '@/modules/lists';
import rootRoute from '@/providers/router/root.route';
import {authOnlyRoute} from '../auth/auth.routes';

export const root = createRoute({
  path: '/lists',
  getParentRoute: () => rootRoute,
  beforeLoad: async ({context, location}) => {
    authOnlyRoute(context.session.get(), location.href);
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
