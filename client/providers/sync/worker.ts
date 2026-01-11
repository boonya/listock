import {logger} from '@/utils/logger';

const sync = (access_token: string) => {
  logger.debug('Running sync operation', {access_token});
};

self.addEventListener('message', (event) => {
  logger.debug('Worker got a message.', event);
  if (event.data.action === 'sync') {
    sync(event.data.access_token);
  }
});

logger.debug('run sync manager');
