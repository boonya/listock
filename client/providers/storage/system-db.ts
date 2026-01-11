import {Dexie, type EntityTable} from 'dexie';
import type {ApiClient} from '@/providers/api-client';

export type Operation = {
  id: number;
  created_at: Date;
  idx: number;
} & (
  | {
      resource: 'lists';
      method: 'create';
      args: Parameters<ApiClient['lists']['create']>;
    }
  | {
      resource: 'lists';
      method: 'update';
      args: Parameters<ApiClient['lists']['update']>;
    }
  | {
      resource: 'lists';
      method: 'remove';
      args: Parameters<ApiClient['lists']['remove']>;
    }
);

const systemDB = new Dexie('System') as Dexie & {
  outbox: EntityTable<Operation, 'id'>;
};

systemDB.version(1).stores({
  outbox: '++id',
});

export {systemDB};
