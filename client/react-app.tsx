import {Suspense} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {Toaster} from 'sonner';
import GeneralErrorMessage from '@/components/errors/general-message';
import Progressbar from '@/components/progressbar';
import {RouterProvider} from '@/providers/router';
import SyncProvider from '@/providers/sync';
import ThemeProvider from '@/providers/theme';

export default function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary fallback={<GeneralErrorMessage sx={{height: '100dvh'}} />}>
        <Suspense fallback={<Progressbar sx={{height: '100dvh'}} />}>
          <RouterProvider />
          <Toaster />
          <SyncProvider />
        </Suspense>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
