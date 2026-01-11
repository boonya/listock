import {getDBInstance} from '@/providers/storage/data-db';

export function getListsStorage() {
  const db = getDBInstance();

  const getAll = () => {
    return db.lists.toArray();
  };

  const listing = async () => {
    const list = await db.lists.filter(({deleted_at}) => !deleted_at).toArray();
    return list.map(({key, id, ...rest}) => ({
      id: key,
      ...rest,
    }));
  };

  const create = async (title = '') => {
    await db.lists.add({
      created_at: new Date(),
      // FIXME: Remove fallback once debugging is done
      title: title || new Date().toISOString().split('T')[1],
    });
  };

  const remove = async (keys: number[]) => {
    const deleted_at = new Date();
    const updates = keys.map((key) => ({
      key,
      changes: {deleted_at},
    }));

    // FIXME: Figure out why it's needed after refactoring
    await db.lists.toArray();
    /** ** */

    await db.lists.bulkUpdate(updates);
  };

  // type Item = {
  //   id: string;
  //   created_at: Date;
  //   updated_at: Date | null;
  //   title: string;
  // };

  // type List = {
  //   id: string;
  //   created_at: Date;
  //   updated_at: Date | null;
  //   title: string;
  //   items: Item[];
  // };
  // const update = async (params: ({id: string} & Partial<List>)[]) => {
  //   const objects = await db.lists.bulkGet(params.map(({id}) => id));
  //   const payload = await Promise.all(
  //     params.map(async ({id, ...params}) => {
  //       const item = await tx.store.get(id);
  //       if (!item) throw new Error('Item not found.');
  //       return {
  //         id,
  //         created_at: params.created_at ?? item.created_at,
  //         updated_at: params.updated_at ?? new Date(),
  //         title: params.title ?? item.title ?? '',
  //         items: params.items ?? item.items ?? [],
  //       };
  //     }),
  //   );
  //   await db.lists.bulkPut(payload);
  // };

  return {getAll, listing, create, /** update, */ remove};
}
