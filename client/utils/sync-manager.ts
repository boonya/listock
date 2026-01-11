import SyncManager from '@/providers/sync/worker?worker';

const worker = new SyncManager();

export function useSyncManager() {
  return worker;
}
