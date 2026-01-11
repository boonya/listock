import {Dexie, type EntityTable} from 'dexie';

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
  const db = new Dexie('data') as Dexie & {
    lists: EntityTable<List, 'key'>;
  };

  db.version(1).stores({
    sessions: '',
    lists: '++key,&id',
  });

  return db;
}

export {getDBInstance};
