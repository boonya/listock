import {Button} from '@mui/material';
import {useSuspenseQuery} from '@tanstack/react-query';
import {useTransition} from 'react';
import {queryMe, useSignOut} from '@/modules/auth/auth.routes';
import {useSession} from '@/providers/auth/session';
import {notifyError} from '@/utils/notify';

export default function SignOutButton() {
  const [session] = useSession();
  // const {data: me} = useSuspenseQuery(queryMe(session));

  const signOut = useSignOut({scope: 'local'});

  const [isPending, startTransition] = useTransition();
  const handleSignOut = () => {
    startTransition(async () => {
      if (confirm('Точно хочеш вийти?')) {
        try {
          await signOut();
        } catch (error) {
          notifyError(['auth'], error, 'Сорі. Вийти не получілось.');
        }
      }
    });
  };

  if (!session) return null;

  return (
    <Button color="inherit" onClick={handleSignOut} loading={isPending}>
      Sign Out
    </Button>
  );
}
