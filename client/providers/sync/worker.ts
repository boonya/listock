import {asyncThrottle} from '@tanstack/react-pacer';
import * as Comlink from 'comlink';
import {liveQuery} from 'dexie';
import {isEqual} from 'date-fns';
import {type ApiClient, getAPIClient} from '@/providers/api/api-client';
import {getDBInstance, type List} from '@/providers/storage/data-db';
import {logger} from '@/utils/logger';

// TODO: Implement truly type-safe message event
export type SyncMessageEvent = MessageEvent<{
  scope: 'sync';
  isRunning: boolean;
}>;

type Session = {
  token_type?: string;
  access_token: string;
};

// @ts-expect-error Ok so far
class SyncManager {
  private db;
  private api?: ApiClient;
  private isRunning = false;
  private session?: Session;

  public constructor() {
    logger.debug(['worker', 'init', 'sync'], 'Init sync manager.');

    this.db = getDBInstance();
    this.observeLists();

    logger.debug(['worker', 'init', 'sync'], 'Sync manager has initialized.');
  }

  private observeLists() {
    const syncLists = asyncThrottle(this.syncLists.bind(this), {
      wait: 5000,
      trailing: true,
      leading: true,
    });

    const observable = liveQuery(() => this.db.lists.toArray());

    return observable.subscribe({
      next: (lists) => syncLists(lists),
      error: (error) => {
        logger.error(['worker', 'sync'], 'Live query error', error);
      },
    });
  }

  public async resume(session: Session) {
    this.session = session;
    this.api = getAPIClient(this.session);

    if (this.isRunning) return;
    logger.debug(['worker', 'sync'], 'Resume sync operations.', this);
  }

  public async suppress() {
    if (!this.isRunning) return;
    logger.debug(['worker', 'sync'], 'Suppress sync operation.', this);
  }

  public async syncLists(lists: List[]) {
    logger.debug(['worker', 'sync'], 'Sync lists init.', {lists}, this);
    if (!this.session || !this.api) {
      logger.debug(['worker', 'sync'], 'API token missed. Sync skipped.', this);
      return;
    }

    if (this.isRunning) return;

    try {
      this.isRunning = true;

      self.postMessage({scope: 'sync', isRunning: this.isRunning});
      logger.debug(['worker', 'sync'], 'Start sync operations.', {lists}, this);

      const toSync = lists.map(({id, ...rest}) => ({
        id: typeof id === 'number' ? null : id,
        ...rest,
      }));
      const synced = await this.api.lists.sync(toSync);

      const local = new Map(lists.map((i) => [i.id, i]));
      const remote = new Map(synced.map((i) => [i.id, i]));

      const remove = [
        ...new Set(local.keys()).difference(new Set(remote.keys())).values(),
      ];

      const create: List[] = [];
      for (const [id, item] of remote) {
        if (local.has(id)) continue;
        create.push(item);
      }

      type Changes = Partial<Omit<List, 'id'>>;
      const update: {key: ID; changes: Changes}[] = [];
      for (const [id, item] of remote) {
        const localItem = local.get(id);
        if (!localItem) continue;

        let changes: Changes | undefined;
        if (item.title !== localItem.title) {
          if (!changes) changes = {};
          changes.title = item.title;
        }
        if (!isEqual(item.created_at, localItem.created_at)) {
          if (!changes) changes = {};
          changes.created_at = item.created_at;
        }
        if (!isEqual(item.updated_at || 0, localItem.updated_at || 0)) {
          if (!changes) changes = {};
          changes.updated_at = item.updated_at;
        }

        if (!changes) continue;

        update.push({key: id, changes});
      }

      console.log({local, remote, remove, create, update});

      await this.db.transaction('rw', this.db.lists, async () => {
        return Promise.all([
          this.db.lists.bulkDelete(remove),
          this.db.lists.bulkAdd(create),
          this.db.lists.bulkUpdate(update),
        ]);
      });

      logger.debug(['worker', 'sync'], 'Sync operations has finished.', {
        synced,
      });
    } catch (error) {
      // biome-ignore lint/complexity/noUselessCatch: I need it here. --- IGNORE ---
      logger.debug(['worker', 'sync'], 'Sync operations has failed.', error);
      throw error;
    } finally {
      this.isRunning = false;
      self.postMessage({scope: 'sync', isRunning: this.isRunning});
    }
  }
}

const manager = new SyncManager();
// @ts-expect-error Ok so far
export type SyncManager = typeof manager;
Comlink.expose(manager);
