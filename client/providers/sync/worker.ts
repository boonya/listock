import {asyncThrottle} from '@tanstack/react-pacer/async-throttler';
import {liveQuery, type Subscription} from 'dexie';
import {getDBInstance} from '@/providers/storage/data-db';
import sync from '@/utils/sync';

const throttledSync = asyncThrottle(sync, {
  wait: 3000,
  onError: (error) => {
    console.error('Sync call failed:', error);
  },
});

const db = getDBInstance();

function subscribeLists(onChange: Function) {
  const $lists = liveQuery(() => db.lists.toArray());
  return $lists.subscribe({
    next: (lists) => {
      console.log('[sync] client listing', lists);
      // TODO: Collect and throttle changes before calling sync
      onChange();
    },
    error: (error) => console.error('[sync] client listing', error),
  });
}

self.addEventListener('message', ({data}) => {
  if (data.isOnline) {
    console.log('The client goes online');
    throttledSync();
  } else {
    console.log('The client goes offline');
  }
});

let lists: Subscription;
const $session = liveQuery(() => db.sessions.get('current'));
$session.subscribe({
  next: (session) => {
    if (!session) {
      console.log('[sync] No session found for sync.');
      lists?.unsubscribe();
      return;
    }
    lists = subscribeLists(throttledSync);
  },
  error: (error) => console.error('[sync] session', error),
});

console.log('run sync manager');
