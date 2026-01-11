import {getDBInstance} from '@/providers/storage/data-db';
import doSync from './do-sync';

export default async () => {
  if (!navigator.onLine) {
    console.warn('[sync] Not online. Quit.');
    return;
  }

  const db = getDBInstance();

  const session = await db.sessions.get('current');
  if (!session?.expires_at) {
    console.warn('[sync] No session found for sync.');
    return;
  }
  if (session.expires_at * 1000 <= Date.now()) {
    console.warn('[sync] Session expired.');
    await db.sessions.delete('current');
    return;
  }
  // TODO: Prolong session or notify user to re-login
  console.log('[sync] Starting sync process...', {session});

  await doSync(session.access_token);

  // Here would go the logic to sync local changes with the server
  console.log('[sync] Sync process completed.');
};
