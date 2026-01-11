import {Dexie, type EntityTable} from 'dexie';
import type {Session} from '@/providers/auth/session';

export type List = {
  key: number;
  id?: string;
  title: string;
  created_at: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
  // items?: {
  //   id: string;
  //   title: string;
  // }[];
};

function getDBInstance() {
  const db = new Dexie('listing-db') as Dexie & {
    // TODO: [session storage] -> localStorage or cookies
    sessions: EntityTable<Session, 'access_token'>;
    lists: EntityTable<List, 'key'>;
  };

  db.version(1).stores({
    sessions: '',
    lists: '++key,&id',
  });

  return db;
}

export {getDBInstance};
