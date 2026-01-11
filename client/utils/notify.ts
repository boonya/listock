import {toast} from 'sonner';
import {logger} from '@/utils/logger';

export function notifyError(error: unknown, message?: string) {
  const msg =
    message || (error instanceof Error ? error.message : 'Щось пішло не так.');
  logger.error(msg, error);
  toast.error(msg);
}
