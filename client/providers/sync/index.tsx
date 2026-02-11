import {useQueryClient} from '@tanstack/react-query';
import * as Comlink from 'comlink';
import {use, useCallback, useDeferredValue, useEffect} from 'react';
import {queryMe} from '@/providers/api/me';
import {queryRefreshSession} from '@/providers/api/session';
import {
  isSessionExpired,
  type Session,
  setSession,
  useSession,
} from '@/providers/auth/session';
import type {SyncManager} from '@/providers/sync/worker';
import Worker from '@/providers/sync/worker?worker';
import {notifyError} from '@/utils/notify';
import {useOnlineStatus} from '@/utils/online-status';
import {useServerStatus} from '@/utils/server-status';

const RemoteSyncManager = Comlink.wrap<typeof SyncManager>(new Worker());
const syncManager = new RemoteSyncManager(API_URL);

export default function SyncProvider() {
  const sync = use(syncManager);

  const queryClient = useQueryClient();
  const [session] = useSession();
  const isClientOnline = useOnlineStatus();
  const isServerAvailable = useServerStatus();

  const isSyncable = useDeferredValue(
    isClientOnline && isServerAvailable && !!session,
  );

  const getLatestSession = useCallback(
    async (session: Session) => {
      if (!isSessionExpired(session)) {
        await queryClient.fetchQuery(queryMe(session));
        return session;
      }

      const new_session = await queryClient.fetchQuery(
        queryRefreshSession(session),
      );
      setSession(new_session);
      return new_session;
    },
    [queryClient],
  );

  const init = useCallback(async () => {
    try {
      if (isSyncable && !!session) {
        const latest_session = await getLatestSession(session);
        await sync.start(latest_session);
      } else {
        await sync.stop();
      }
    } catch (error) {
      notifyError(['worker', 'sync'], error, 'Помилка синхронізації.');
    }
  }, [isSyncable, session, sync, getLatestSession]);

  useEffect(() => {
    void init();
  }, [init]);

  return null;
}
