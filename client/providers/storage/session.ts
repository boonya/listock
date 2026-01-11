import type {Session} from '@/providers/auth/session';
import {getDBInstance} from '@/providers/storage/data-db';

export const sessionStorageChannel = new BroadcastChannel('session-storage');

export function getSessionStorage() {
  const db = getDBInstance();

  const get = () => {
    return db.sessions.get('current');
  };

  const put = async (params: Session) => {
    await db.sessions.put(params, 'current');
  };

  const remove = async (id = 'current') => {
    await db.sessions.delete('current');
  };

  return {get, put, remove};
}
