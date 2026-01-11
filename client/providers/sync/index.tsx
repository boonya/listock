import {useEffect} from 'react';
import {notifyError} from '@/utils/notify';
import {useOnlineStatusEvents} from '@/utils/online-status';
import {useSyncManager} from '@/utils/sync-manager';

export default function SyncProvider() {
  const syncManager = useSyncManager();
  useOnlineStatusEvents((isOnline) => syncManager.postMessage({isOnline}));

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
