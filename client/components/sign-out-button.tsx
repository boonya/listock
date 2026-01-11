import {Button} from '@mui/material';
import {useQueryClient, useSuspenseQuery} from '@tanstack/react-query';
import {useNavigate} from '@tanstack/react-router';
import {useTransition} from 'react';
import {removeSession} from '@/providers/auth/session';
import {sessionQueries} from '@/providers/query-client/session';

export default function SignOutButton() {
  const queryClient = useQueryClient();
  const {data: session} = useSuspenseQuery(sessionQueries.current());
  const navigate = useNavigate();

  const signOut = async () => {
    if (confirm('Sure?')) {
      await removeSession();
      await queryClient.invalidateQueries(sessionQueries.current());
      await navigate({to: '/'});
    }
  };

  const [isPending, startTransition] = useTransition();
  const handleSignOut = () => {
    startTransition(() => {
      signOut();
    });
  };

  if (!session) return null;

  return (
    <Button color="inherit" onClick={handleSignOut} loading={isPending}>
      Sign Out
    </Button>
  );
}
