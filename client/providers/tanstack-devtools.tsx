import {TanStackDevtools} from '@tanstack/react-devtools';
import {PacerDevtoolsPanel} from '@tanstack/react-pacer-devtools';
import {ReactQueryDevtoolsPanel} from '@tanstack/react-query-devtools';
import {TanStackRouterDevtoolsPanel} from '@tanstack/react-router-devtools';
import {useEffect} from 'react';
import {useSessionStorage} from 'usehooks-ts';
import {logger} from '@/utils/logger';

declare global {
  interface Window {
    __TANSTACK_DEVTOOLS_TOGGLE: () => void;
  }
}

export default function DevTools() {
  const [show, setShow] = useSessionStorage('TanStackDevtools', false);

  useEffect(() => {
    // TODO: Take a look at this one and decide how to deal with.
    // eslint-disable-next-line unicorn/prefer-global-this
    window.__TANSTACK_DEVTOOLS_TOGGLE = () => {
      setShow((prev) => {
        const value = !prev;
        logger.info(
          [],
          `TanStackDevtools are ${value ? 'enabled' : 'disabled'}`,
        );
        return value;
      });
    };
  }, [setShow]);

  if (!show) return false;

  return (
    <TanStackDevtools
      plugins={[
        {
          name: 'TanStack Query',
          render: <ReactQueryDevtoolsPanel />,
        },
        {
          name: 'TanStack Router',
          render: <TanStackRouterDevtoolsPanel />,
        },
        {
          name: 'TanStack Pacer',
          render: <PacerDevtoolsPanel />,
        },
      ]}
    />
  );
}
