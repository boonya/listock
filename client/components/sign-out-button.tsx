import {Button} from '@mui/material';
import {useRouter} from '@tanstack/react-router';
import {useTransition} from 'react';
import {useSession} from '@/providers/auth/session';

export default function SignOutButton() {
  const router = useRouter();
  const [session, {remove: removeSession}] = useSession();

  const signOut = async () => {
    if (confirm('Sure?')) {
      removeSession();
      router.invalidate();
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
