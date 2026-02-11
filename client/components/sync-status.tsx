import {Box, CircularProgress, styled, Tooltip} from '@mui/material';
import {useOnlineStatus} from '@/utils/online-status';
import {useServerStatus} from '@/utils/server-status';
import {useSyncStatus} from '@/utils/sync-status';

const Container = styled(Box)(() => ({
  position: 'relative',
  height: 20,
  width: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const Dot = styled(Box, {
  shouldForwardProp: (propName) => propName !== 'color',
})<{color: string}>(({color}) => ({
  position: 'absolute',
  backgroundColor: color,
  borderRadius: '50%',
  height: 12,
  width: 12,
  zIndex: 1,
}));

export default function SyncStatusIndicator() {
  const isClientOnline = useOnlineStatus();
  const isServerAvailable = useServerStatus();
  const isSyncing = useSyncStatus();

  const title = !isClientOnline
    ? 'Offline'
    : isServerAvailable
      ? 'Online'
      : 'Server in not available';

  const color = isClientOnline && isServerAvailable ? 'green' : 'red';

  return (
    <Tooltip title={title}>
      <Container>
        {isSyncing && (
          <CircularProgress
            variant="indeterminate"
            size={18}
            sx={{position: 'absolute', zIndex: 2}}
          />
        )}
        <Dot color={color} />
      </Container>
    </Tooltip>
  );
}
