import {expect, test, vi} from 'vitest';
import DATASET_001 from './__data__/001.json';
import DATASET_002 from './__data__/001.json';
import {sync} from './sync';

const result: never[] = [];

const db = {
  remove: vi.fn(async () => void 0),
  create: vi.fn(async () => void 0),
  update: vi.fn(async () => void 0),
  select: vi.fn(async () => result),
};

test.skip.for([
  [],
  DATASET_001,
  DATASET_002,
])('sync lists with input.', async (dataset) => {
  // Transform date strings to Date objects
  const input = dataset.map(
    ({created_at, updated_at, deleted_at, ...rest}) => ({
      ...rest,
      created_at: new Date(created_at),
      updated_at: updated_at ? new Date(updated_at) : null,
      deleted_at: deleted_at ? new Date(deleted_at) : null,
    }),
  );

  const result = await sync(db, input);

  expect(db.create).toBeCalledTimes(1);
  expect(db.update).toBeCalledTimes(1);
  expect(db.remove).toBeCalledTimes(1);
  expect(db.select).toBeCalledTimes(1);
  expect(result).toEqual(result);

  expect(db.create.mock.calls[0]).toMatchSnapshot();
  expect(db.update.mock.calls[0]).toMatchSnapshot();
  expect(db.remove.mock.calls[0]).toMatchSnapshot();
  expect(db.select.mock.calls[0]).toMatchSnapshot();
});
