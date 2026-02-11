import {useQuery} from '@tanstack/react-query';
import {queryPing} from '@/providers/api/ping';

export function useServerStatus() {
  const {status} = useQuery(queryPing());
  return status === 'success';
}
