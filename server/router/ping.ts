import {os} from '@orpc/server';

export default os.route({method: 'GET'}).handler(async () => {
  return new Date().toISOString();
});
