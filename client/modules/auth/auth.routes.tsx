import {createRoute, redirect} from '@tanstack/react-router';
import z from 'zod';
import {sessionQueries} from '@/providers/query-client/session';
import rootRoute from '@/providers/router/root.route';
import SignIn from './sign-in';
import SignUp from './sign-up';

export const signInRoute = createRoute({
  path: '/sign-in',
  getParentRoute: () => rootRoute,
  component: SignIn,
  validateSearch: z.object({
    redirect_to: z.string().optional(),
  }),
  beforeLoad: async ({context}) => {
    const session = await context.queryClient.fetchQuery(
      sessionQueries.current(),
    );
    if (session) {
      throw redirect({
        to: '/',
      });
    }
  },
});

export const signUpRoute = createRoute({
  path: '/sign-up',
  getParentRoute: () => rootRoute,
  component: SignUp,
  validateSearch: z.object({
    redirect_to: z.string().optional(),
  }),
  beforeLoad: async ({context}) => {
    const session = await context.queryClient.fetchQuery(
      sessionQueries.current(),
    );
    if (session) {
      throw redirect({
        to: '/',
      });
    }
  },
});
