import {createRoute, redirect, useRouter} from '@tanstack/react-router';
import {useCallback} from 'react';
import z from 'zod';
import {useApiClient} from '@/providers/api/api-client';
import {getSession, removeSession} from '@/providers/auth/session';
import rootRoute from '@/providers/router/root.route';
import SignIn from './sign-in';
import SignUp from './sign-up';

export const authOnlyRoute = async (redirect_back: string) => {
  const session = getSession();
  if (session) {
    return true;
  }

  throw redirect({
    to: '/sign-in',
    search: {
      // Use the current location to power a redirect after login
      // (Do not use `router.state.resolvedLocation` as it can
      // potentially lag behind the actual current location)
      redirect_to: redirect_back,
    },
  });
};

export const nonAuthOnlyRoute = async () => {
  const session = getSession();
  if (!session) {
    return true;
  }

  throw redirect({
    to: '/',
  });
};

export function useSignOut(params?: {scope: 'local' | 'global' | 'others'}) {
  const router = useRouter();
  const api = useApiClient();

  return useCallback(async () => {
    await api.user.sign_out(params);
    removeSession();
    router.invalidate();
  }, [api.user.sign_out, router.invalidate, params]);
}

export const signInRoute = createRoute({
  path: '/sign-in',
  getParentRoute: () => rootRoute,
  component: SignIn,
  validateSearch: z.object({
    redirect_to: z.string().optional(),
  }),
  beforeLoad: async () => {
    await nonAuthOnlyRoute();
  },
});

export const signUpRoute = createRoute({
  path: '/sign-up',
  getParentRoute: () => rootRoute,
  component: SignUp,
  validateSearch: z.object({
    redirect_to: z.string().optional(),
  }),
  beforeLoad: async () => {
    await nonAuthOnlyRoute();
  },
});
