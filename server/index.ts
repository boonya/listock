import {createServer} from 'node:http';
import {onError} from '@orpc/server';
import {RPCHandler} from '@orpc/server/node';
import {CORSPlugin, RequestHeadersPlugin} from '@orpc/server/plugins';
import getEnvs from '@/env';
import {logger} from '@/logger';
import {router} from '@/router';

logger.info('Server starting...');

const {HOSTNAME, PORT} = getEnvs();

const handler = new RPCHandler(router, {
  plugins: [new CORSPlugin(), new RequestHeadersPlugin()],
  interceptors: [
    onError((error) => {
      logger.error(error, 'RPC Error occurred');
    }),
  ],
});

const server = createServer(async (req, res) => {
  const result = await handler.handle(req, res, {
    context: {
      jwt: req?.headers.authorization?.split(' ').splice(-1)[0] || undefined,
    },
  });

  if (!result.matched) {
    res.statusCode = 404;
    res.end('No procedure matched');
  }
});

server.listen(PORT, HOSTNAME, () => {
  logger.info(`Listening on ${HOSTNAME}:${PORT}`);
});
