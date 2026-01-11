import {Alert, Button, Snackbar} from '@mui/material';
import {useEffect, useState} from 'react';

export function ServiceWorkerUpdate() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
    null,
  );

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Reload the page when new service worker takes control
        globalThis.location.reload();
      });

      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                // New update available
                setWaitingWorker(newWorker);
                setShowUpdate(true);
              }
            });
          }
        });
      });
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({type: 'SKIP_WAITING'});
      setShowUpdate(false);
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  return (
    <Snackbar
      open={showUpdate}
      anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
    >
      <Alert
        severity="info"
        action={
          <>
            <Button color="inherit" size="small" onClick={handleUpdate}>
              Update
            </Button>
            <Button color="inherit" size="small" onClick={handleDismiss}>
              Later
            </Button>
          </>
        }
      >
        A new version is available. Reload to update?
      </Alert>
    </Snackbar>
  );
}
