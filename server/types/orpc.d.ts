import type {RequestHeadersPluginContext} from '@orpc/server/plugins';

export interface ORPCContext extends RequestHeadersPluginContext {
  jwt: string | undefined;
}
