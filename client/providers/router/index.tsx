import {
  createRoute,
  // createLazyRoute,
  createRouter,
  Navigate,
  // Link,
} from '@tanstack/react-router';
import NotFound from '@/components/errors/404';
import GeneralError from '@/components/errors/general-message';
import Progressbar from '@/components/progressbar';
import {signInRoute, signUpRoute} from '@/modules/auth/auth.routes';
import listsRoutes from '@/modules/lists/lists.routes';
import {queryClient} from '@/providers/query-client';
import rootRoute from '@/providers/router/root.route';

const homeRoute = createRoute({
  path: '/',
  getParentRoute: () => rootRoute,
  component: () => <Navigate to="/lists" />,
  // component: () => (
  //   <ul>
  //     <li>
  //       <Link to="/lists">Go to Lists</Link>
  //     </li>
  //     <li>
  //       <Link to="/test">Go to Test</Link>
  //     </li>
  //   </ul>
  // ),
});

// const testRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/test',
// }).lazy(() => import('@/modules/test').then((d) => d.default));

const routeTree = rootRoute.addChildren([
  homeRoute,
  signInRoute,
  signUpRoute,
  listsRoutes,
  // testRoute,
]);

const router = createRouter({
  routeTree,
  defaultPendingComponent: () => <Progressbar />,
  defaultErrorComponent: () => <GeneralError />,
  defaultNotFoundComponent: () => <NotFound />,
  context: {
    queryClient,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default router;
