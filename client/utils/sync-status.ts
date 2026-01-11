import {useEffect, useState} from 'react';
import {useSyncManager} from './sync-manager';

// import { SyncInfo } from '@/providers/sync/worker';

type OnChange = (isSyncing: boolean) => unknown;

export function useSyncStatusEvents(onChange: OnChange) {
  const syncManager = useSyncManager();

  useEffect(() => {
    const controller = new AbortController();

    syncManager.addEventListener(
      'message',
      ({data} /** : MessageEvent<SyncInfo>  */) => {
        if (data.scope === 'sync' && data.type === 'info') {
          onChange(data.isSyncing);
        }
      },
      {signal: controller.signal},
    );

    return () => {
      controller.abort();
    };
  }, [onChange, syncManager.addEventListener]);
}

export function useSyncStatus(onChange?: OnChange) {
  const [isSyncing, setSyncing] = useState(false);

  useSyncStatusEvents((value) => {
    setSyncing(value);
    onChange?.(value);
  });

  return isSyncing;
}
