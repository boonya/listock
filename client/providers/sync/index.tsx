import {useEffect} from 'react';
import {getSession, isSessionExpired} from '@/providers/auth/session';
import {notifyError} from '@/utils/notify';
import {useOnlineStatusEvents} from '@/utils/online-status';
import {useSyncManager} from '@/utils/sync-manager';

export default function SyncProvider() {
  const syncManager = useSyncManager();

  useOnlineStatusEvents((isOnline) => {
    console.log('isOnline', isOnline);
    syncManager.postMessage({isOnline});
    if (isOnline) {
      const session = getSession();
      if (!session) return;
      if (isSessionExpired(session)) return;
      syncManager.postMessage({
        action: 'sync',
        access_token: session.access_token,
      });
    }
  });

  useEffect(() => {
    const controller = new AbortController();

    syncManager.addEventListener(
      'error',
      (error) => {
        notifyError(error, 'Помилка обробника синхронізації.');
      },
      {signal: controller.signal},
    );

    return () => {
      controller.abort();
    };
  }, [syncManager.addEventListener]);

  return null;
}
