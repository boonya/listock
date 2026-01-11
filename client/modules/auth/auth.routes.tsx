import {createRoute, ParsedLocation, redirect} from '@tanstack/react-router';
import z from 'zod';
import type {Session} from '@/providers/auth/session';
import rootRoute from '@/providers/router/root.route';
import SignIn from './sign-in';
import SignUp from './sign-up';

export const authOnlyRoute = (session: Session | null, redirect_to: string) => {
  if (session) return;
  throw redirect({
    to: '/sign-in',
    search: {
      // Use the current location to power a redirect after login
      // (Do not use `router.state.resolvedLocation` as it can
      // potentially lag behind the actual current location)
      redirect_to,
    },
  });
};

export const nonAuthOnlyRoute = (session: Session | null) => {
  if (!session) return;
  throw redirect({
    to: '/',
  });
};

export const signInRoute = createRoute({
  path: '/sign-in',
  getParentRoute: () => rootRoute,
  component: SignIn,
  validateSearch: z.object({
    redirect_to: z.string().optional(),
  }),
  beforeLoad: async ({context}) => {
    nonAuthOnlyRoute(context.session.get());
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
    nonAuthOnlyRoute(context.session.get());
  },
});
